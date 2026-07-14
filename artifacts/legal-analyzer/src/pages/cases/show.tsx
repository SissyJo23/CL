import React from "react";

export default function CaseShow(): JSX.Element {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-semibold">Case page temporarily unavailable</h1>
        <p className="text-sm text-muted-foreground mt-2">A recent deploy introduced a syntax error in this file; it has been temporarily replaced so your site can build. Please restore the full page content from your prior commit when ready.</p>
      </div>
    </div>
  );
}
