import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link href="/" data-testid="link-breadcrumb-home">
        <div className="hover-elevate active-elevate-2 p-1 rounded cursor-pointer flex items-center gap-1">
          <Home className="h-4 w-4" />
        </div>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} data-testid={`link-breadcrumb-${index}`}>
              <span className="hover-elevate active-elevate-2 p-1 rounded cursor-pointer">
                {item.label}
              </span>
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
