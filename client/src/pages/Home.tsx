import { Navbar } from "@/components/Navbar";
import { DepartmentCard } from "@/components/DepartmentCard";
import { StatsCard } from "@/components/StatsCard";
import { BookOpen, FileText, Users } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@assets/generated_images/University_library_study_scene_5c31f025.png";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { College } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: colleges = [], isLoading } = useQuery<College[]>({
    queryKey: ["/api/colleges"],
  });

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalColleges = colleges.length;

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

      <motion.section 
        className="py-12 md:py-16 border-b"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Colleges" value={totalColleges} icon={BookOpen} />
            <StatsCard title="Departments" value={60} icon={FileText} />
            <StatsCard title="Students" value="2,500+" icon={Users} description="Active users" />
            <StatsCard title="Resources" value="Growing" icon={FileText} description="Upload & share" />
          </div>
        </div>
      </motion.section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-2">Browse by College</h2>
            <p className="text-muted-foreground">
              Select your college to access course materials and study resources
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredColleges.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {filteredColleges.map((college) => (
                <motion.div
                  key={college.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <DepartmentCard {...college} description={college.description || undefined} courseCount={0} fileCount={0} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">No colleges found matching "{searchQuery}"</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
