import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { uploadFormSchema, signupSchema, verifyEmailSchema, loginSchema, type User } from "@shared/schema";
import { generateVaultId, generateVerificationToken, getVerificationExpiry, isTokenExpired } from "./auth-utils";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

async function sendVerificationEmail(email: string, token: string, vaultId: string) {
  const verificationUrl = `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:5000'}/verify?token=${token}`;
  
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   EMAIL VERIFICATION                            ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${email.padEnd(56)} ║
║ Vault ID: ${vaultId.padEnd(51)} ║
║ Verification Link:                                             ║
║ ${verificationUrl.padEnd(62)} ║
╚════════════════════════════════════════════════════════════════╝
  `);
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const vaultId = generateVaultId();
      const verificationToken = generateVerificationToken();
      const verificationExpiry = getVerificationExpiry();
      
      const user = await storage.createUser({
        email: validatedData.email,
        displayName: validatedData.displayName ?? null,
        vaultId,
        verificationToken,
        verificationExpiry,
      });
      
      await sendVerificationEmail(validatedData.email, verificationToken, vaultId);
      
      res.status(201).json({
        message: "Account created! Please check your email to verify your account.",
        vaultId,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create account" });
      }
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token } = verifyEmailSchema.parse(req.body);
      
      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      
      if (isTokenExpired(user.verificationExpiry)) {
        return res.status(400).json({ message: "Verification token has expired" });
      }
      
      await storage.updateUser(user.id, {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null,
      });
      
      res.json({
        message: "Email verified successfully! You can now log in with your Vault ID.",
        vaultId: user.vaultId,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Verification failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { vaultId } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByVaultId(vaultId);
      if (!user) {
        return res.status(401).json({ message: "Invalid Vault ID" });
      }
      
      if (!user.emailVerified) {
        return res.status(401).json({ message: "Please verify your email before logging in" });
      }
      
      req.session.userId = user.id;
      
      const userResponse: Partial<User> = {
        id: user.id,
        vaultId: user.vaultId,
        email: user.email,
        displayName: user.displayName,
        reputation: user.reputation,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      };
      
      res.json({ user: userResponse });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }
      
      const userResponse: Partial<User> = {
        id: user.id,
        vaultId: user.vaultId,
        email: user.email,
        displayName: user.displayName,
        reputation: user.reputation,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      };
      
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
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

  app.get("/api/departments", async (_req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Please log in to upload files" });
      }

      const validatedData = uploadFormSchema.parse(req.body);
      
      const course = await storage.findOrCreateCourse(
        validatedData.departmentId,
        validatedData.courseCode,
        validatedData.courseTitle || validatedData.courseCode,
        parseInt(validatedData.level)
      );
      
      const timestamp = Date.now();
      const sanitizedFileName = validatedData.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const file = await storage.createFile({
        courseId: course.id,
        userId: req.session.userId,
        title: validatedData.title,
        fileName: validatedData.fileName,
        fileType: validatedData.fileType,
        fileUrl: `/uploads/${timestamp}-${sanitizedFileName}`,
        fileSize: validatedData.fileSize,
      });

      res.status(201).json(file);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to upload file" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
