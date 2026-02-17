import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Page({ className, ...props }: ComponentProps<"div">) {
  return (
    <main
      className={cn("mx-auto size-full flex-1 px-2 py-6", className)}
      {...props}
    />
  );
}

function PageHeader({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="page-header"
      className={cn("grid px-6 pt-4", className)}
      {...props}
    />
  );
}

function PageTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-title"
      className={cn(
        "mb-3 text-2xl/tight font-semibold tracking-normal",
        className,
      )}
      {...props}
    />
  );
}

function PageSubTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-sub-title"
      className={cn("mb-2 text-lg/snug font-medium tracking-normal", className)}
      {...props}
    />
  );
}

function PageDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-description"
      className={cn(
        "text-muted-foreground space-y-2 text-sm/snug tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

function PageContent({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="page-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function PageFooter({ className, ...props }: ComponentProps<"footer">) {
  return (
    <footer
      data-slot="page-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Page,
  PageHeader,
  PageTitle,
  PageSubTitle,
  PageDescription,
  PageContent,
  PageFooter,
};
