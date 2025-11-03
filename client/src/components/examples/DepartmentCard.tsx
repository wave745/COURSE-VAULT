import { DepartmentCard } from "../DepartmentCard";

export default function DepartmentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <DepartmentCard
        id="1"
        name="Computer Science & Information Technology"
        slug="computer-science"
        description="Core computing, software engineering, and IT management"
        courseCount={24}
        fileCount={156}
      />
      <DepartmentCard
        id="2"
        name="Medicine & Surgery"
        slug="medicine"
        description="Medical sciences and clinical practice"
        courseCount={42}
        fileCount={289}
      />
      <DepartmentCard
        id="3"
        name="Law"
        slug="law"
        courseCount={18}
        fileCount={94}
      />
    </div>
  );
}
