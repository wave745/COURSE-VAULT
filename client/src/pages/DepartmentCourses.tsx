import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LevelSelector } from "@/components/LevelSelector";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Course, Department, College } from "@shared/schema";
import emptyCoursesImg from "@assets/generated_images/Empty_courses_illustration_4bb89d06.png";

export default function DepartmentCourses() {
  const [, params] = useRoute("/department/:slug");
  const slug = params?.slug || "";
  const [selectedLevel, setSelectedLevel] = useState(200);

  const { data: department, isLoading: departmentLoading } = useQuery<Department>({
    queryKey: ["/api/departments", slug],
    enabled: !!slug,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/departments", slug, "courses"],
    enabled: !!slug && !!department,
  });

  const { data: college } = useQuery<College>({
    queryKey: ["/api/colleges", department?.collegeId],
    enabled: !!department?.collegeId,
  });

  const isLoading = departmentLoading || coursesLoading;
  const filteredCourses = courses.filter((course) => course.level === selectedLevel);

  // Get file counts for each course by querying files for each course
  const coursesWithFileCounts = filteredCourses.map((course) => {
    // For now, we'll use 0 as default - file count will be fetched when course details are viewed
    // In a real scenario, you might want to add an endpoint that returns course with file count
    return { ...course, fileCount: 0 };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : department ? (
          <>
            <Breadcrumbs
              items={[
                { label: college?.name || "College", href: college ? `/college/${college.slug}` : undefined },
                { label: department.name },
              ]}
            />

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{department.name}</h1>
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
                {selectedLevel}L Courses ({coursesWithFileCounts.length})
              </h2>
            </div>

            {coursesWithFileCounts.length > 0 ? (
              <div className="grid gap-4">
                {coursesWithFileCounts.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    code={course.code}
                    title={course.title}
                    level={course.level}
                    semester={course.semester || undefined}
                    fileCount={course.fileCount}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                imageSrc={emptyCoursesImg}
                title="No courses found"
                description={`There are no courses available for ${selectedLevel}L in this department yet.`}
              />
            )}
          </>
        ) : (
          <EmptyState
            imageSrc={emptyCoursesImg}
            title="Department not found"
            description="The department you're looking for doesn't exist."
          />
        )}
      </div>
    </div>
  );
}
