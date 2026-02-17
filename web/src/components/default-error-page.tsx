import { Link } from "@tanstack/react-router";
import { Button } from "@/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/ui/empty";

export const DefaultErrorPage = () => {
  return (
    <main className="grid h-screen items-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Something went wrong</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
};
