import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/colleges", async (_req, res) => {
    try {
      const colleges = await storage.getColleges();
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });

  app.get("/api/colleges/:slug", async (req, res) => {
    try {
      const college = await storage.getCollegeBySlug(req.params.slug);
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      res.json(college);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch college" });
    }
  });

  app.get("/api/colleges/:slug/departments", async (req, res) => {
    try {
      const college = await storage.getCollegeBySlug(req.params.slug);
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      const departments = await storage.getDepartments(college.id);
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.get("/api/departments/:slug", async (req, res) => {
    try {
      const department = await storage.getDepartmentBySlug(req.params.slug);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch department" });
    }
  });

  app.get("/api/departments/:slug/courses", async (req, res) => {
    try {
      const department = await storage.getDepartmentBySlug(req.params.slug);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      const courses = await storage.getCourses(department.id);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.get("/api/courses/:id/files", async (req, res) => {
    try {
      const files = await storage.getFiles(req.params.id);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
