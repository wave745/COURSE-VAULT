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

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email ?? null,
      displayName: insertUser.displayName ?? null,
      reputation: 0, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
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
