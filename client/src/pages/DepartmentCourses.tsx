import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LevelSelector } from "@/components/LevelSelector";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { useRoute } from "wouter";
import emptyCoursesImg from "@assets/generated_images/Empty_courses_illustration_4bb89d06.png";

const mockCourses = {
  "computer-science": [
    { id: "1", code: "CSC101", title: "Introduction to Computer Science", semester: "First" as const, level: 100, fileCount: 12 },
    { id: "2", code: "CSC102", title: "Computer Fundamentals", semester: "Second" as const, level: 100, fileCount: 8 },
    { id: "3", code: "CSC201", title: "Introduction to Programming", semester: "First" as const, level: 200, fileCount: 24, description: "Python programming and algorithmic thinking" },
    { id: "4", code: "CSC202", title: "Data Structures and Algorithms", semester: "Second" as const, level: 200, fileCount: 18 },
    { id: "5", code: "CSC301", title: "Database Management Systems", semester: "First" as const, level: 300, fileCount: 32 },
    { id: "6", code: "CSC302", title: "Operating Systems", semester: "Second" as const, level: 300, fileCount: 21 },
    { id: "7", code: "CSC401", title: "Software Engineering", semester: "First" as const, level: 400, fileCount: 28 },
    { id: "8", code: "CSC402", title: "Computer Networks", semester: "Second" as const, level: 400, fileCount: 19 },
  ],
  "economics": [
    { id: "9", code: "ECO101", title: "Principles of Economics I", semester: "First" as const, level: 100, fileCount: 16 },
    { id: "10", code: "ECO102", title: "Principles of Economics II", semester: "Second" as const, level: 100, fileCount: 14 },
    { id: "11", code: "ECO201", title: "Microeconomics", semester: "First" as const, level: 200, fileCount: 22 },
    { id: "12", code: "ECO202", title: "Macroeconomics", semester: "Second" as const, level: 200, fileCount: 19 },
  ],
};

const departmentNames: Record<string, { name: string; college: string; collegeName: string }> = {
  "computer-science": { name: "Department of Computer Science", college: "natural-applied-science", collegeName: "College of Natural and Applied Science" },
  "economics": { name: "Department of Economics", college: "arts-social-sciences", collegeName: "College of Arts and Social Sciences" },
  "law": { name: "Department of Law", college: "law", collegeName: "College of Law" },
};

export default function DepartmentCourses() {
  const [, params] = useRoute("/department/:slug");
  const slug = params?.slug || "";
  const [selectedLevel, setSelectedLevel] = useState(200);

  const deptInfo = departmentNames[slug] || { name: slug, college: "", collegeName: "" };
  const allCourses = mockCourses[slug as keyof typeof mockCourses] || [];
  const filteredCourses = allCourses.filter((course) => course.level === selectedLevel);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Breadcrumbs
          items={[
            { label: deptInfo.collegeName, href: `/college/${deptInfo.college}` },
            { label: deptInfo.name },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{deptInfo.name}</h1>
          <p className="text-muted-foreground">
            Browse courses and study materials for this department
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Level</h2>
          <LevelSelector selectedLevel={selectedLevel} onLevelChange={setSelectedLevel} />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {selectedLevel}L Courses ({filteredCourses.length})
          </h2>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <EmptyState
            imageSrc={emptyCoursesImg}
            title="No courses found"
            description={`There are no courses available for ${selectedLevel}L in this department yet.`}
          />
        )}
      </div>
    </div>
  );
}
