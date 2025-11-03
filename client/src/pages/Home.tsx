import { Navbar } from "@/components/Navbar";
import { DepartmentCard } from "@/components/DepartmentCard";
import { StatsCard } from "@/components/StatsCard";
import { BookOpen, FileText, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@assets/generated_images/University_library_study_scene_5c31f025.png";

const departments = [
  { id: "1", name: "Accounting", slug: "accounting", courseCount: 16, fileCount: 89 },
  { id: "2", name: "Agricultural Economics", slug: "agricultural-economics", courseCount: 12, fileCount: 54 },
  { id: "3", name: "Agriculture", slug: "agriculture", courseCount: 18, fileCount: 76 },
  { id: "4", name: "Anatomy", slug: "anatomy", courseCount: 14, fileCount: 102 },
  { id: "5", name: "Banking & Finance", slug: "banking-finance", courseCount: 15, fileCount: 67 },
  { id: "6", name: "Biochemistry", slug: "biochemistry", courseCount: 20, fileCount: 134 },
  { id: "7", name: "Business Management", slug: "business-management", courseCount: 17, fileCount: 92 },
  { id: "8", name: "Chemical Engineering", slug: "chemical-engineering", courseCount: 22, fileCount: 118 },
  { id: "9", name: "Chemistry", slug: "chemistry", courseCount: 19, fileCount: 105 },
  { id: "10", name: "Civil Engineering", slug: "civil-engineering", courseCount: 24, fileCount: 142 },
  { id: "11", name: "Computer Engineering", slug: "computer-engineering", courseCount: 21, fileCount: 156 },
  { id: "12", name: "Computer Science & Information Technology", slug: "computer-science", courseCount: 24, fileCount: 198, description: "Core computing, software engineering, and IT management" },
  { id: "13", name: "Cyber Security", slug: "cyber-security", courseCount: 18, fileCount: 87 },
  { id: "14", name: "Economics & Development Studies", slug: "economics", courseCount: 16, fileCount: 73 },
  { id: "15", name: "Electrical/Electronics Engineering", slug: "electrical-engineering", courseCount: 23, fileCount: 129 },
  { id: "16", name: "English Language", slug: "english", courseCount: 14, fileCount: 68 },
  { id: "17", name: "Environmental Engineering", slug: "environmental-engineering", courseCount: 19, fileCount: 94 },
  { id: "18", name: "Environmental Management", slug: "environmental-management", courseCount: 15, fileCount: 71 },
  { id: "19", name: "Food Science & Technology", slug: "food-science", courseCount: 17, fileCount: 82 },
  { id: "20", name: "French", slug: "french", courseCount: 12, fileCount: 45 },
  { id: "21", name: "Geography & Regional Planning", slug: "geography", courseCount: 16, fileCount: 69 },
  { id: "22", name: "Industrial Chemistry", slug: "industrial-chemistry", courseCount: 18, fileCount: 96 },
  { id: "23", name: "International Relationship & Strategic Studies", slug: "international-relations", courseCount: 14, fileCount: 58 },
  { id: "24", name: "Law", slug: "law", courseCount: 20, fileCount: 145, description: "Legal practice, jurisprudence, and statutory law" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchValue={searchQuery} onSearchChange={setSearchQuery} />

      <section
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Access IUO's Complete Course Archive
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse, upload, and download study materials shared by students across all departments and levels
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search departments, courses, or files..."
                className="pl-11 h-14 rounded-full text-base bg-background/90 backdrop-blur"
                data-testid="input-hero-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Departments" value={45} icon={BookOpen} />
            <StatsCard title="Courses" value="1,200+" icon={FileText} />
            <StatsCard title="Files Shared" value="8,500+" icon={FileText} />
            <StatsCard title="Active Students" value="3,400+" icon={Users} description="Contributing daily" />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Browse by Department</h2>
            <p className="text-muted-foreground">
              Select your department to access course materials and study resources
            </p>
          </div>

          {filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDepartments.map((dept) => (
                <DepartmentCard key={dept.id} {...dept} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No departments found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
