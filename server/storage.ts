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
} from "@shared/schema";
import { seedColleges, seedDepartments } from "./seed-data";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
