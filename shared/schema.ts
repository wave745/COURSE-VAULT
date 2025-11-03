import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  reputation: integer("reputation").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

export const departments = pgTable("departments", {
  id: varchar("id").primaryKey(),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  departmentId: varchar("department_id").notNull().references(() => departments.id),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  level: integer("level").notNull(),
  semester: text("semester"),
});

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  verified: boolean("verified").notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileId: varchar("file_id").notNull().references(() => files.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  downloadedAt: timestamp("downloaded_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  reputation: true,
  createdAt: true,
});

export const insertCollegeSchema = createInsertSchema(colleges);

export const insertDepartmentSchema = createInsertSchema(departments);

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  verified: true,
  downloadCount: true,
  uploadedAt: true,
});

export const uploadFormSchema = z.object({
  departmentId: z.string().min(1, "Department is required"),
  level: z.string().min(1, "Level is required"),
  courseCode: z.string().min(1, "Course code is required"),
  courseTitle: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  downloadedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type College = typeof colleges.$inferSelect;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export type UploadForm = z.infer<typeof uploadFormSchema>;

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;
