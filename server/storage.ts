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
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
  createCourse(course: InsertCourse): Promise<Course>;

  getFiles(courseId?: string): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  incrementDownloadCount(fileId: string): Promise<void>;

  createDownload(download: InsertDownload): Promise<Download>;
  getUserDownloads(userId: string): Promise<Download[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getColleges(): Promise<College[]> {
    return await db.select().from(colleges);
  }

  async getCollege(id: string): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college;
  }

  async getCollegeBySlug(slug: string): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.slug, slug));
    return college;
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const [college] = await db.insert(colleges).values(insertCollege).returning();
    return college;
  }

  async getDepartments(collegeId?: string): Promise<Department[]> {
    if (collegeId) {
      return await db.select().from(departments).where(eq(departments.collegeId, collegeId));
    }
    return await db.select().from(departments);
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async getDepartmentBySlug(slug: string): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.slug, slug));
    return department;
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const [department] = await db.insert(departments).values(insertDepartment).returning();
    return department;
  }

  async getCourses(departmentId?: string): Promise<Course[]> {
    if (departmentId) {
      return await db.select().from(courses).where(eq(courses.departmentId, departmentId));
    }
    return await db.select().from(courses);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCoursesByLevel(departmentId: string, level: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(and(eq(courses.departmentId, departmentId), eq(courses.level, level)));
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async getFiles(courseId?: string): Promise<File[]> {
    if (courseId) {
      return await db
        .select()
        .from(files)
        .where(eq(files.courseId, courseId))
        .orderBy(desc(files.uploadedAt));
    }
    return await db.select().from(files).orderBy(desc(files.uploadedAt));
  }

  async getFile(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }

  async incrementDownloadCount(fileId: string): Promise<void> {
    await db
      .update(files)
      .set({ downloadCount: sql`${files.downloadCount} + 1` })
      .where(eq(files.id, fileId));
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db.insert(downloads).values(insertDownload).returning();
    return download;
  }

  async getUserDownloads(userId: string): Promise<Download[]> {
    return await db.select().from(downloads).where(eq(downloads.userId, userId));
  }
}

export const storage = new DatabaseStorage();
