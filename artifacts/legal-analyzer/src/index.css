@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-card-border: hsl(var(--card-border));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-popover-border: hsl(var(--popover-border));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-primary-border: var(--primary-border);

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-secondary-border: var(--secondary-border);

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-muted-border: var(--muted-border);

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-accent-border: var(--accent-border);

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-destructive-border: var(--destructive-border);

  --font-sans: var(--app-font-sans);
  --font-serif: var(--app-font-serif);
  --font-mono: var(--app-font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --button-outline: rgba(0,0,0, .10);
  --badge-outline: rgba(0,0,0, .05);

  --opaque-button-border-intensity: -8;

  --elevate-1: rgba(0,0,0, .03);
  --elevate-2: rgba(0,0,0, .08);

  --background: 40 33% 98%; /* Warm, off-white #fdfbf7 */
  --foreground: 220 20% 15%; /* Deep slate #1f2530 */
  
  --border: 40 10% 88%;
  --input: 40 10% 88%;
  --ring: 220 20% 15%;

  --card: 0 0% 100%;
  --card-foreground: 220 20% 15%;
  --card-border: 40 10% 88%;

  --popover: 0 0% 100%;
  --popover-foreground: 220 20% 15%;
  --popover-border: 40 10% 88%;

  --primary: 220 20% 15%;
  --primary-foreground: 40 33% 98%;

  --secondary: 40 10% 93%;
  --secondary-foreground: 220 20% 15%;

  --muted: 40 10% 93%;
  --muted-foreground: 220 10% 40%;

  --accent: 40 10% 93%;
  --accent-foreground: 220 20% 15%;

  --destructive: 0 70% 45%;
  --destructive-foreground: 0 0% 100%;

  --app-font-sans: 'DM Sans', sans-serif;
  --app-font-serif: 'Playfair Display', serif;
  --app-font-mono: Menlo, monospace;
  --radius: 0.5rem;
}

.dark {
  --button-outline: rgba(255,255,255, .10);
  --badge-outline: rgba(255,255,255, .05);
  --opaque-button-border-intensity: 9;

  --elevate-1: rgba(255,255,255, .04);
  --elevate-2: rgba(255,255,255, .09);

  --background: 220 20% 10%;
  --foreground: 40 33% 98%;
  --border: 220 20% 20%;
  --input: 220 20% 20%;
  --ring: 40 33% 98%;
  
  --card: 220 20% 13%;
  --card-foreground: 40 33% 98%;
  --card-border: 220 20% 20%;

  --popover: 220 20% 13%;
  --popover-foreground: 40 33% 98%;
  --popover-border: 220 20% 20%;

  --primary: 40 33% 98%;
  --primary-foreground: 220 20% 15%;

  --secondary: 220 20% 20%;
  --secondary-foreground: 40 33% 98%;

  --muted: 220 20% 20%;
  --muted-foreground: 220 10% 60%;

  --accent: 220 20% 20%;
  --accent-foreground: 40 33% 98%;

  --destructive: 0 70% 45%;
  --destructive-foreground: 0 0% 100%;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply font-sans antialiased bg-background text-foreground;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif tracking-tight;
  }
}

@media print {
  /* Hide chrome */
  header, footer, .no-print { display: none !important; }

  /* Page margins */
  @page { margin: 0.75in; size: letter portrait; }

  /* White background, black text */
  body { background: white !important; color: black !important; }

  /* Prevent cards and round blocks from splitting across pages */
  .print-block { page-break-inside: avoid; break-inside: avoid; }

  /* Collapse the two-column State/Defense grid to single column */
  .print-single-col { grid-template-columns: 1fr !important; }

  /* Remove shadows and borders for cleaner print */
  * { box-shadow: none !important; }

  /* Ensure links don't show URLs */
  a::after { content: none !important; }

  /* Force full width */
  main, .container { max-width: 100% !important; width: 100% !important; }
}
