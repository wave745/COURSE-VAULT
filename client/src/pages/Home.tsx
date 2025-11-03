import { Navbar } from "@/components/Navbar";
import { DepartmentCard } from "@/components/DepartmentCard";
import { StatsCard } from "@/components/StatsCard";
import { BookOpen, FileText, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@assets/generated_images/University_library_study_scene_5c31f025.png";

const colleges = [
  { id: "ASS", name: "College of Arts and Social Sciences", slug: "arts-social-sciences", courseCount: 142, fileCount: 856, description: "9 departments including Economics, English, Mass Communication" },
  { id: "BMS", name: "College of Business and Management Studies", slug: "business-management", courseCount: 98, fileCount: 612, description: "Business, economics, and management disciplines" },
  { id: "ENG", name: "College of Engineering", slug: "engineering", courseCount: 221, fileCount: 1483, description: "10 departments including Chemical, Civil, Mechanical, Petroleum Engineering" },
  { id: "HSC", name: "College of Health Sciences", slug: "health-sciences", courseCount: 275, fileCount: 2191, description: "14 departments including Medicine, Surgery, Nursing, Radiology" },
  { id: "JUPEB", name: "JUPEB", slug: "jupeb", courseCount: 89, fileCount: 422, description: "10 subject combinations for pre-degree studies" },
  { id: "LAW", name: "College of Law", slug: "law", courseCount: 45, fileCount: 289, description: "Legal practice, jurisprudence, and statutory law" },
  { id: "NAS", name: "College of Natural and Applied Science", slug: "natural-applied-science", courseCount: 167, fileCount: 1043, description: "Pure and applied sciences, mathematics, and computer science" },
  { id: "OAU", name: "Other Academic Units", slug: "other-academic-units", courseCount: 32, fileCount: 124, description: "General studies and interdisciplinary courses" },
  { id: "PHM", name: "College of Pharmacy", slug: "pharmacy", courseCount: 52, fileCount: 367, description: "Pharmaceutical sciences and clinical pharmacy" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                placeholder="Search colleges, courses, or files..."
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
            <StatsCard title="Colleges" value={9} icon={BookOpen} />
            <StatsCard title="Courses" value="961" icon={FileText} />
            <StatsCard title="Files Shared" value="6,179" icon={FileText} />
            <StatsCard title="Active Students" value="3,400+" icon={Users} description="Contributing daily" />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Browse by College</h2>
            <p className="text-muted-foreground">
              Select your college to access course materials and study resources
            </p>
          </div>

          {filteredColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => (
                <DepartmentCard key={college.id} {...college} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No colleges found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
