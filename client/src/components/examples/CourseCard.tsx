import { CourseCard } from "../CourseCard";

export default function CourseCardExample() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-3xl">
      <CourseCard
        id="1"
        code="CSC201"
        title="Introduction to Programming"
        semester="First"
        level={200}
        fileCount={24}
        description="Fundamentals of programming using Python and algorithmic thinking"
      />
      <CourseCard
        id="2"
        code="CSC202"
        title="Data Structures and Algorithms"
        semester="Second"
        level={200}
        fileCount={18}
      />
      <CourseCard
        id="3"
        code="CSC301"
        title="Database Management Systems"
        semester="First"
        level={300}
        fileCount={32}
        description="Design and implementation of database systems"
      />
    </div>
  );
}
