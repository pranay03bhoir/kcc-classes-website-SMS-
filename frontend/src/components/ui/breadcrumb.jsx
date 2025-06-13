import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Breadcrumb = ({ className, ...props }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)} {...props} />
  );
};

const BreadcrumbList = ({ className, ...props }) => {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
};

const BreadcrumbItem = ({ className, ...props }) => {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5 sm:gap-2.5", className)}
      {...props}
    />
  );
};

const BreadcrumbLink = ({
  className,
  href,
  isCurrentPage,
  children,
  ...props
}) => {
  const Comp = href ? Link : "span";

  return (
    <Comp
      href={href}
      className={cn(
        "transition-colors hover:text-foreground",
        isCurrentPage ? "font-medium text-foreground" : "text-muted-foreground",
        className
      )}
      aria-current={isCurrentPage ? "page" : undefined}
      {...props}
    >
      {children}
    </Comp>
  );
};

const BreadcrumbPage = ({ className, ...props }) => {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({ children, className, ...props }) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight className="h-4 w-4" />}
    </li>
  );
};

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
