import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DepartmentCard } from "@/components/DepartmentCard";
import { useRoute } from "wouter";

const collegeDepartments: Record<string, Array<{ id: string; name: string; slug: string; code: string; courseCount: number; fileCount: number }>> = {
  "arts-social-sciences": [
    { id: "ECO", code: "ECO", name: "Department of Economics", slug: "economics", courseCount: 18, fileCount: 124 },
    { id: "ENG", code: "ENG", name: "Department of English", slug: "english", courseCount: 16, fileCount: 89 },
    { id: "FRL", code: "FRL", name: "Department of Foreign Language", slug: "foreign-language", courseCount: 14, fileCount: 67 },
    { id: "GRP", code: "GRP", name: "Department of Geography", slug: "geography", courseCount: 15, fileCount: 82 },
    { id: "IRS", code: "IRS", name: "Department of International Relations", slug: "international-relations", courseCount: 17, fileCount: 95 },
    { id: "MAS", code: "MAS", name: "Department of Mass Communication", slug: "mass-communication", courseCount: 19, fileCount: 134 },
    { id: "POL", code: "POL", name: "Department of Political Science", slug: "political-science", courseCount: 16, fileCount: 98 },
    { id: "SAA", code: "SAA", name: "Department of Sociology", slug: "sociology", courseCount: 15, fileCount: 87 },
    { id: "THA", code: "THA", name: "Department of Theater Arts and Film Production", slug: "theater-arts", courseCount: 12, fileCount: 76 },
  ],
  "business-management": [
    { id: "ACC", code: "ACC", name: "Department of Accounting", slug: "accounting", courseCount: 20, fileCount: 145 },
    { id: "BFN", code: "BFN", name: "Department of Finance", slug: "finance", courseCount: 18, fileCount: 132 },
    { id: "BUS", code: "BUS", name: "Department of Business Administration", slug: "business-administration", courseCount: 22, fileCount: 167 },
  ],
  "engineering": [
    { id: "CHE", code: "CHE", name: "Department of Chemical Engineering", slug: "chemical-engineering", courseCount: 24, fileCount: 189 },
    { id: "CME", code: "CME", name: "Department of Computer Engineering", slug: "computer-engineering", courseCount: 23, fileCount: 178 },
    { id: "CVE", code: "CVE", name: "Department of Civil Engineering", slug: "civil-engineering", courseCount: 26, fileCount: 203 },
    { id: "ECE", code: "ECE", name: "Department of Electrical and Computer Engineering", slug: "electrical-computer-engineering", courseCount: 22, fileCount: 167 },
    { id: "EEE", code: "EEE", name: "Department of Electrical/Electronics Engineering", slug: "electrical-engineering", courseCount: 25, fileCount: 195 },
    { id: "EVE", code: "EVE", name: "Department of Environmental Engineering", slug: "environmental-engineering", courseCount: 18, fileCount: 134 },
    { id: "FDS", code: "FDS", name: "Department of Food Science", slug: "food-science", courseCount: 16, fileCount: 112 },
    { id: "MEE", code: "MEE", name: "Department of Mechanical Engineering", slug: "mechanical-engineering", courseCount: 24, fileCount: 182 },
    { id: "MTE", code: "MTE", name: "Department of Mechatronics Engineering", slug: "mechatronics-engineering", courseCount: 22, fileCount: 156 },
    { id: "PET", code: "PET", name: "Department of Petroleum Engineering", slug: "petroleum-engineering", courseCount: 21, fileCount: 167 },
  ],
  "health-sciences": [
    { id: "ANA", code: "ANA", name: "Department of Anatomy", slug: "anatomy", courseCount: 18, fileCount: 145 },
    { id: "BMS", code: "BMS", name: "School of Basic Medical Science", slug: "basic-medical-science", courseCount: 24, fileCount: 189 },
    { id: "MED", code: "MED", name: "Department of Medicine", slug: "medicine", courseCount: 42, fileCount: 356 },
    { id: "MLS", code: "MLS", name: "Department of Medical Laboratory Science", slug: "medical-lab-science", courseCount: 19, fileCount: 134 },
    { id: "NUR", code: "NUR", name: "Department of Nursing Science", slug: "nursing", courseCount: 22, fileCount: 198 },
    { id: "OBS", code: "OBS", name: "Department of Obstetrics & Gynecology", slug: "obstetrics-gynecology", courseCount: 16, fileCount: 127 },
    { id: "OPH", code: "OPH", name: "Department of Ophthalmology", slug: "ophthalmology", courseCount: 14, fileCount: 98 },
    { id: "ORT", code: "ORT", name: "Department of Orthopedic surgeon", slug: "orthopedic", courseCount: 15, fileCount: 112 },
    { id: "PED", code: "PED", name: "Department of Pediatrics", slug: "pediatrics", courseCount: 18, fileCount: 143 },
    { id: "PHS", code: "PHS", name: "Department of Physiology", slug: "physiology", courseCount: 17, fileCount: 142 },
    { id: "PMS", code: "PMS", name: "Medical Sciences", slug: "medical-sciences", courseCount: 20, fileCount: 156 },
    { id: "PMY", code: "PMY", name: "Department of Pharmacology", slug: "pharmacology", courseCount: 16, fileCount: 124 },
    { id: "RAD", code: "RAD", name: "Department of Radiology", slug: "radiology", courseCount: 13, fileCount: 89 },
    { id: "SUR", code: "SUR", name: "Department of Surgery", slug: "surgery", courseCount: 21, fileCount: 178 },
  ],
  "law": [
    { id: "LAW", code: "LAW", name: "Department of Law", slug: "law", courseCount: 45, fileCount: 289 },
  ],
  "natural-applied-science": [
    { id: "CHM", code: "CHM", name: "Department of Chemistry", slug: "chemistry", courseCount: 22, fileCount: 178 },
    { id: "CSC", code: "CSC", name: "Department of Computer Science", slug: "computer-science", courseCount: 26, fileCount: 234 },
    { id: "CYB", code: "CYB", name: "Department of Cyber Security", slug: "cyber-security", courseCount: 20, fileCount: 156 },
    { id: "MIC", code: "MIC", name: "Department of Microbiology", slug: "microbiology", courseCount: 19, fileCount: 145 },
    { id: "PHY", code: "PHY", name: "Department of Physics", slug: "physics", courseCount: 21, fileCount: 167 },
    { id: "SWE", code: "SWE", name: "Department of Software Engineering", slug: "software-engineering", courseCount: 24, fileCount: 189 },
  ],
  "pharmacy": [
    { id: "PHM", code: "PHM", name: "Department of Pharmacy", slug: "pharmacy", courseCount: 32, fileCount: 245 },
    { id: "PHA", code: "PHA", name: "Department of Pharmacology", slug: "pharmacology", courseCount: 20, fileCount: 122 },
  ],
};

const collegeNames: Record<string, string> = {
  "arts-social-sciences": "College of Arts and Social Sciences",
  "business-management": "College of Business and Management Studies",
  "engineering": "College of Engineering",
  "health-sciences": "College of Health Sciences",
  "jupeb": "JUPEB",
  "law": "College of Law",
  "natural-applied-science": "College of Natural and Applied Science",
  "other-academic-units": "Other Academic Units",
  "pharmacy": "College of Pharmacy",
};

export default function Department() {
  const [, params] = useRoute("/college/:slug");
  const slug = params?.slug || "";

  const collegeName = collegeNames[slug] || slug;
  const departments = collegeDepartments[slug] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Breadcrumbs items={[{ label: collegeName }]} />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{collegeName}</h1>
          <p className="text-muted-foreground">
            Select a department to browse courses and study materials
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Departments ({departments.length})
          </h2>
        </div>

        {departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} {...dept} isCollege={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No departments available for this college.</p>
          </div>
        )}
      </div>
    </div>
  );
}
