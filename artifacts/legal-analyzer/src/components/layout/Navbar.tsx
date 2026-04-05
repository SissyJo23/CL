import { Link } from "wouter";

export default function Navbar() {
  return (
    <header className="w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight text-foreground transition-colors hover:text-primary">
          CaseLight
        </Link>
      </div>
    </header>
  );
}
