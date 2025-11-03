import { Breadcrumbs } from "../Breadcrumbs";

export default function BreadcrumbsExample() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: "Computer Science", href: "/department/computer-science" },
          { label: "200 Level" },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Computer Science", href: "/department/computer-science" },
          { label: "200 Level", href: "/department/computer-science/200" },
          { label: "CSC 201" },
        ]}
      />
    </div>
  );
}
