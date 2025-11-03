import {
  type User,
  type InsertUser,
  type College,
  type InsertCollege,
  type Department,
  type InsertDepartment,
  type Course,
  type InsertCourse,
  type File,
  type InsertFile,
  type Download,
  type InsertDownload,
  users,
  colleges,
  departments,
  courses,
  files,
  downloads,
} from "@shared/schema";
import { seedColleges, seedDepartments } from "./seed-data";
import { randomUUID } from "crypto";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVaultId(vaultId: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  getColleges(): Promise<College[]>;
  getCollege(id: string): Promise<College | undefined>;
  getCollegeBySlug(slug: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;

  getDepartments(collegeId?: string): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | undefined>;
  getDepartmentBySlug(slug: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;

  getCourses(departmentId?: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getCoursesByLevel(departmentId: string, level: number): Promise<Course[]>;
  getCourseByCode(departmentId: string, code: string, level: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  findOrCreateCourse(departmentId: string, code: string, title: string, level: number): Promise<Course>;

  getFiles(courseId?: string): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  incrementDownloadCount(fileId: string): Promise<void>;

  createDownload(download: InsertDownload): Promise<Download>;
  getUserDownloads(userId: string): Promise<Download[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private colleges: Map<string, College>;
  private departments: Map<string, Department>;
  private courses: Map<string, Course>;
  private files: Map<string, File>;
  private downloads: Map<string, Download>;

  constructor() {
    this.users = new Map();
    this.colleges = new Map();
    this.departments = new Map();
    this.courses = new Map();
    this.files = new Map();
    this.downloads = new Map();

    seedColleges.forEach((college) => {
      this.colleges.set(college.id, college as College);
    });

    seedDepartments.forEach((dept) => {
      this.departments.set(dept.id, dept as Department);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getUserByVaultId(vaultId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.vaultId === vaultId);
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.verificationToken === token);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      displayName: insertUser.displayName ?? null,
      verificationToken: insertUser.verificationToken ?? null,
      verificationExpiry: insertUser.verificationExpiry ?? null,
      emailVerified: false,
      reputation: 0, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getColleges(): Promise<College[]> {
    return Array.from(this.colleges.values());
  }

  async getCollege(id: string): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async getCollegeBySlug(slug: string): Promise<College | undefined> {
    return Array.from(this.colleges.values()).find((c) => c.slug === slug);
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const college = insertCollege as College;
    this.colleges.set(college.id, college);
    return college;
  }

  async getDepartments(collegeId?: string): Promise<Department[]> {
    const allDepts = Array.from(this.departments.values());
    if (collegeId) {
      return allDepts.filter((d) => d.collegeId === collegeId);
    }
    return allDepts;
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async getDepartmentBySlug(slug: string): Promise<Department | undefined> {
    return Array.from(this.departments.values()).find((d) => d.slug === slug);
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const department = insertDepartment as Department;
    this.departments.set(department.id, department);
    return department;
  }

  async getCourses(departmentId?: string): Promise<Course[]> {
    const allCourses = Array.from(this.courses.values());
    if (departmentId) {
      return allCourses.filter((c) => c.departmentId === departmentId);
    }
    return allCourses;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCoursesByLevel(departmentId: string, level: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (c) => c.departmentId === departmentId && c.level === level
    );
  }

  async getCourseByCode(departmentId: string, code: string, level: number): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(
      (c) => c.departmentId === departmentId && c.code === code && c.level === level
    );
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = { 
      ...insertCourse, 
      id,
      description: insertCourse.description ?? null,
      semester: insertCourse.semester ?? null
    };
    this.courses.set(id, course);
    return course;
  }

  async findOrCreateCourse(departmentId: string, code: string, title: string, level: number): Promise<Course> {
    const existing = await this.getCourseByCode(departmentId, code, level);
    if (existing) {
      return existing;
    }
    return this.createCourse({
      departmentId,
      code,
      title,
      level,
    });
  }

  async getFiles(courseId?: string): Promise<File[]> {
    const allFiles = Array.from(this.files.values());
    if (courseId) {
      return allFiles.filter((f) => f.courseId === courseId).sort(
        (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
      );
    }
    return allFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = { 
      ...insertFile, 
      id,
      fileSize: insertFile.fileSize ?? null,
      verified: false, 
      downloadCount: 0, 
      uploadedAt: new Date() 
    };
    this.files.set(id, file);
    return file;
  }

  async incrementDownloadCount(fileId: string): Promise<void> {
    const file = this.files.get(fileId);
    if (file) {
      file.downloadCount++;
      this.files.set(fileId, file);
    }
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const download: Download = { ...insertDownload, id, downloadedAt: new Date() };
    this.downloads.set(id, download);
    return download;
  }

  async getUserDownloads(userId: string): Promise<Download[]> {
    return Array.from(this.downloads.values()).filter((d) => d.userId === userId);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByVaultId(vaultId: string): Promise<User | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [user] = await db.select().from(users).where(eq(users.vaultId, vaultId));
    return user || undefined;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!process.env.DATABASE_URL) throw new Error("Database not available");
    const { db } = await import("./db");
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getColleges(): Promise<College[]> {
    if (!process.env.DATABASE_URL) return [];
    const { db } = await import("./db");
    const collegeList = await db.select().from(colleges);
    if (collegeList.length === 0) {
      await db.insert(colleges).values(seedColleges);
      return seedColleges as College[];
    }
    return collegeList;
  }

  async getCollege(id: string): Promise<College | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college || undefined;
  }

  async getCollegeBySlug(slug: string): Promise<College | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [college] = await db.select().from(colleges).where(eq(colleges.slug, slug));
    return college || undefined;
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    if (!process.env.DATABASE_URL) throw new Error("Database not available");
    const { db } = await import("./db");
    const [college] = await db.insert(colleges).values(insertCollege).returning();
    return college;
  }

  async getDepartments(collegeId?: string): Promise<Department[]> {
    if (!process.env.DATABASE_URL) return [];
    const { db } = await import("./db");
    const departmentList = collegeId 
      ? await db.select().from(departments).where(eq(departments.collegeId, collegeId))
      : await db.select().from(departments);
    
    if (departmentList.length === 0 && !collegeId) {
      await db.insert(departments).values(seedDepartments);
      return seedDepartments as Department[];
    }
    return departmentList;
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }

  async getDepartmentBySlug(slug: string): Promise<Department | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [department] = await db.select().from(departments).where(eq(departments.slug, slug));
    return department || undefined;
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    if (!process.env.DATABASE_URL) throw new Error("Database not available");
    const { db } = await import("./db");
    const [department] = await db.insert(departments).values(insertDepartment).returning();
    return department;
  }

  async getCourses(departmentId?: string): Promise<Course[]> {
    if (!process.env.DATABASE_URL) return [];
    const { db } = await import("./db");
    return departmentId
      ? await db.select().from(courses).where(eq(courses.departmentId, departmentId))
      : await db.select().from(courses);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCoursesByLevel(departmentId: string, level: number): Promise<Course[]> {
    if (!process.env.DATABASE_URL) return [];
    const { db } = await import("./db");
    return await db.select().from(courses).where(
      and(eq(courses.departmentId, departmentId), eq(courses.level, level))
    );
  }

  async getCourseByCode(departmentId: string, code: string, level: number): Promise<Course | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [course] = await db.select().from(courses).where(
      and(
        eq(courses.departmentId, departmentId),
        eq(courses.code, code),
        eq(courses.level, level)
      )
    );
    return course || undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    if (!process.env.DATABASE_URL) throw new Error("Database not available");
    const { db } = await import("./db");
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async findOrCreateCourse(departmentId: string, code: string, title: string, level: number): Promise<Course> {
    const existing = await this.getCourseByCode(departmentId, code, level);
    if (existing) {
      return existing;
    }
    return this.createCourse({
      departmentId,
      code,
      title,
      level,
    });
  }

  async getFiles(courseId?: string): Promise<File[]> {
    if (!process.env.DATABASE_URL) return [];
    const { db } = await import("./db");
    return courseId
      ? await db.select().from(files).where(eq(files.courseId, courseId)).orderBy(desc(files.uploadedAt))
      : await db.select().from(files).orderBy(desc(files.uploadedAt));
  }

  async getFile(id: string): Promise<File | undefined> {
    if (!process.env.DATABASE_URL) return undefined;
    const { db } = await import("./db");
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    if (!process.env.DATABASE_URL) throw new Error("Database not available");
    const { db } = await import("./db");
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }

  async incrementDownloadCount(fileId: string): Promise<void> {
    if (!process.env.DATABASE_URL) return;
    const { db } = await import("./db");
    const file = await this.getFile(fileId);
    if (file) {
      await db.update(files)
        .set({ downloadCount: file.downloadCount + 1 })
        .where(eq(files.id, fileId));
    }
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    if (!process.env.DATABASE_URL) throw new Error("Database not available");
    const { db } = await import("./db");
    const [download] = await db.insert(downloads).values(insertDownload).returning();
    return download;
  }

  async getUserDownloads(userId: string): Promise<Download[]> {
    if (!process.env.DATABASE_URL) return [];
    const { db } = await import("./db");
    return await db.select().from(downloads).where(eq(downloads.userId, userId));
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
