import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DepartmentCard } from "@/components/DepartmentCard";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Department, College } from "@shared/schema";

export default function Department() {
  const [, params] = useRoute("/college/:slug");
  const slug = params?.slug || "";

  const { data: college, isLoading: collegeLoading } = useQuery<College>({
    queryKey: ["/api/colleges", slug],
    enabled: !!slug,
  });

  const { data: departments = [], isLoading: departmentsLoading } = useQuery<Department[]>({
    queryKey: ["/api/colleges", slug, "departments"],
    enabled: !!slug,
  });

  const isLoading = collegeLoading || departmentsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Breadcrumbs items={[{ label: college?.name || slug }]} />

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{college?.name || slug}</h1>
          <p className="text-muted-foreground">
            {college?.description || "Select a department to browse courses and study materials"}
          </p>
        </motion.div>

        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold">
            Departments ({departments.length})
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : departments.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            {departments.map((dept) => (
              <motion.div
                key={dept.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
              >
                <DepartmentCard {...dept} name={dept.name} description={dept.name} courseCount={0} fileCount={0} isCollege={false} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground">No departments available for this college.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
