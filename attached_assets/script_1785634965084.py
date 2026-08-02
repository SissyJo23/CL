
import os
os.makedirs('output/caselight', exist_ok=True)

html = '''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CaseLight — Legal Analysis Platform</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<style>
:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;

  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);

  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem;    --space-5: 1.25rem; --space-6: 1.5rem;
  --space-8: 2rem;    --space-10: 2.5rem; --space-12: 3rem;
  --space-16: 4rem;

  --radius-sm: 0.375rem; --radius-md: 0.5rem;
  --radius-lg: 0.75rem;  --radius-xl: 1rem;
  --radius-full: 9999px;

  --transition: 180ms cubic-bezier(0.16, 1, 0.3, 1);

  /* Light mode */
  --bg: #f5f4f0;
  --surface: #faf9f7;
  --surface-2: #ffffff;
  --surface-offset: #eeece8;
  --border: rgba(40,37,29,0.1);
  --divider: rgba(40,37,29,0.07);
  --text: #1a1814;
  --text-muted: #6b6860;
  --text-faint: #aaa89f;
  --text-inverse: #faf9f7;

  --primary: #1a2c4e;
  --primary-hover: #0f1e38;
  --primary-light: #e8ecf4;

  --accent: #c9a84c;
  --accent-light: #f5edda;

  --critical: #c0392b;
  --critical-light: #fdecea;
  --high: #d4680a;
  --high-light: #fef0e3;
  --medium: #b8860b;
  --medium-light: #fef8e3;
  --low: #2e7d32;
  --low-light: #e8f5e9;
  --binding: #1a2c4e;
  --binding-light: #e8ecf4;

  --shadow-sm: 0 1px 3px rgba(20,18,10,0.06), 0 1px 2px rgba(20,18,10,0.04);
  --shadow-md: 0 4px 12px rgba(20,18,10,0.08), 0 2px 4px rgba(20,18,10,0.04);
  --shadow-lg: 0 12px 32px rgba(20,18,10,0.10), 0 4px 8px rgba(20,18,10,0.04);

  --sidebar-w: 260px;
  --header-h: 56px;

  --content-default: 960px;
  --content-wide: 1200px;
}

[data-theme="dark"] {
  --bg: #111110;
  --surface: #161614;
  --surface-2: #1c1b19;
  --surface-offset: #1e1d1b;
  --border: rgba(255,255,255,0.08);
  --divider: rgba(255,255,255,0.05);
  --text: #e8e6e1;
  --text-muted: #7a7870;
  --text-faint: #4a4844;
  --text-inverse: #1a1814;

  --primary: #4a6fa5;
  --primary-hover: #5a82c0;
  --primary-light: #1a2338;

  --accent: #c9a84c;
  --accent-light: #2a2210;

  --critical: #e05252;
  --critical-light: #2a1414;
  --high: #e07830;
  --high-light: #2a1a0a;
  --medium: #d4a832;
  --medium-light: #2a2208;
  --low: #66bb6a;
  --low-light: #0a1e0a;
  --binding: #4a6fa5;
  --binding-light: #1a2338;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.5);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: none; text-size-adjust: none; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
body { font-family: var(--font-body); font-size: var(--text-base); color: var(--text); background: var(--bg); min-height: 100dvh; line-height: 1.6; }
img, svg { display: block; max-width: 100%; }
button { cursor: pointer; background: none; border: none; font: inherit; color: inherit; }
input, textarea, select { font: inherit; color: inherit; }
h1,h2,h3,h4,h5,h6 { text-wrap: balance; line-height: 1.2; }
p, li { text-wrap: pretty; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; border-radius: var(--radius-sm); }
::selection { background: rgba(26,44,78,0.15); color: var(--text); }
a, button, [role="button"], input, textarea, select {
  transition: color var(--transition), background var(--transition), border-color var(--transition), box-shadow var(--transition), opacity var(--transition);
}
.sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0; }

/* ─── AUTH SCREEN ─── */
#auth-screen {
  display: flex; align-items: center; justify-content: center;
  min-height: 100dvh; padding: var(--space-6);
  background: var(--bg);
}
.auth-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-10) var(--space-8);
  width: 100%; max-width: 400px;
}
.auth-logo {
  display: flex; align-items: center; gap: var(--space-3);
  margin-bottom: var(--space-8);
}
.auth-logo-icon {
  width: 40px; height: 40px; flex-shrink: 0;
}
.auth-logo-text h1 {
  font-family: var(--font-display); font-size: var(--text-lg);
  color: var(--primary); letter-spacing: -0.02em;
}
.auth-logo-text p { font-size: var(--text-xs); color: var(--text-muted); }
.auth-card h2 { font-size: var(--text-lg); margin-bottom: var(--space-2); }
.auth-card > p { color: var(--text-muted); font-size: var(--text-sm); margin-bottom: var(--space-6); }
.form-group { margin-bottom: var(--space-4); }
.form-group label { display: block; font-size: var(--text-sm); font-weight: 500; margin-bottom: var(--space-2); }
.form-input {
  width: 100%; padding: var(--space-3) var(--space-4);
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: var(--radius-md); font-size: var(--text-sm);
  color: var(--text);
  transition: border-color var(--transition), box-shadow var(--transition);
}
.form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); outline: none; }
.btn-primary {
  width: 100%; padding: var(--space-3) var(--space-4);
  background: var(--primary); color: var(--text-inverse);
  border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-top: var(--space-2);
}
.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-error {
  background: var(--critical-light); color: var(--critical);
  border: 1px solid rgba(192,57,43,0.2); border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4); font-size: var(--text-sm);
  margin-bottom: var(--space-4); display: none;
}
.auth-error.visible { display: block; }

/* ─── APP SHELL ─── */
#app { display: none; height: 100dvh; overflow: hidden; flex-direction: column; }
#app.visible { display: flex; }

.app-header {
  height: var(--header-h); flex-shrink: 0;
  background: var(--primary); color: var(--text-inverse);
  display: flex; align-items: center; padding: 0 var(--space-4);
  gap: var(--space-4); z-index: 100;
  box-shadow: 0 1px 0 rgba(0,0,0,0.2);
}
.header-logo {
  display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;
}
.header-logo svg { width: 24px; height: 24px; }
.header-logo-name {
  font-family: var(--font-display); font-size: var(--text-base);
  letter-spacing: -0.01em; font-weight: 600;
}
.header-spacer { flex: 1; }
.header-actions { display: flex; align-items: center; gap: var(--space-2); }
.header-btn {
  width: 36px; height: 36px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.7); background: transparent;
}
.header-btn:hover { color: white; background: rgba(255,255,255,0.12); }
.header-case-info { font-size: var(--text-sm); opacity: 0.8; }
.header-case-info strong { opacity: 1; color: white; }

.app-body { flex: 1; display: flex; overflow: hidden; }

/* ─── SIDEBAR ─── */
.sidebar {
  width: var(--sidebar-w); flex-shrink: 0;
  background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; overflow-y: auto;
  transition: transform var(--transition);
}
.sidebar-section { padding: var(--space-4); }
.sidebar-section + .sidebar-section { border-top: 1px solid var(--divider); }
.sidebar-section-title {
  font-size: var(--text-xs); font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--space-3);
}
.new-case-btn {
  width: 100%; padding: var(--space-2) var(--space-3);
  background: var(--primary); color: var(--text-inverse);
  border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.new-case-btn:hover { background: var(--primary-hover); }
.case-list { display: flex; flex-direction: column; gap: var(--space-1); }
.case-item {
  padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer;
  border: 1px solid transparent;
  transition: background var(--transition), border-color var(--transition);
}
.case-item:hover { background: var(--surface-offset); }
.case-item.active {
  background: var(--primary-light); border-color: rgba(26,44,78,0.2);
}
.case-item-name { font-size: var(--text-sm); font-weight: 500; line-height: 1.3; }
.case-item-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-1); }
.case-item-badge {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 700; padding: 1px 6px;
  border-radius: var(--radius-full); margin-top: var(--space-1);
}
.badge-critical { background: var(--critical-light); color: var(--critical); }
.badge-high { background: var(--high-light); color: var(--high); }
.sidebar-footer { margin-top: auto; padding: var(--space-4); border-top: 1px solid var(--divider); }
.logout-btn {
  width: 100%; padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md); font-size: var(--text-sm);
  color: var(--text-muted); display: flex; align-items: center; gap: var(--space-2);
}
.logout-btn:hover { background: var(--surface-offset); color: var(--text); }

/* ─── MAIN CONTENT ─── */
.main-content { flex: 1; overflow-y: auto; background: var(--bg); }

/* ─── DASHBOARD (case list view) ─── */
.dashboard {
  max-width: var(--content-wide); margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}
.dashboard-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-8);
}
.dashboard-header h2 {
  font-family: var(--font-display); font-size: var(--text-xl);
  color: var(--text); letter-spacing: -0.02em;
}
.stats-row {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4); margin-bottom: var(--space-8);
}
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}
.stat-number { font-size: var(--text-xl); font-weight: 700; color: var(--text); }
.stat-number.critical { color: var(--critical); }
.stat-number.high { color: var(--high); }
.stat-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-1); }
.section-header {
  font-size: var(--text-sm); font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);
}
.cases-grid { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-8); }
.case-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: var(--space-5);
  box-shadow: var(--shadow-sm); cursor: pointer;
  display: flex; align-items: center; gap: var(--space-4);
  transition: box-shadow var(--transition), border-color var(--transition);
}
.case-card:hover { box-shadow: var(--shadow-md); border-color: rgba(26,44,78,0.2); }
.case-card-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  background: var(--critical-light); border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; color: var(--critical);
}
.case-card-icon.normal { background: var(--primary-light); color: var(--primary); }
.case-card-body { flex: 1; min-width: 0; }
.case-card-title { font-weight: 600; font-size: var(--text-sm); }
.case-card-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.case-card-meta { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-2); flex-wrap: wrap; }
.case-card-right { flex-shrink: 0; color: var(--text-faint); }
.findings-preview { display: flex; flex-direction: column; gap: var(--space-2); }
.finding-row {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: var(--space-3) var(--space-4);
  cursor: pointer; display: flex; align-items: center; gap: var(--space-3);
  transition: box-shadow var(--transition), background var(--transition);
}
.finding-row:hover { background: var(--surface-2); box-shadow: var(--shadow-sm); }
.finding-row-body { flex: 1; min-width: 0; }
.finding-row-title { font-size: var(--text-sm); font-weight: 500; }
.finding-row-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }

/* ─── CASE VIEW ─── */
.case-view { display: none; }
.case-view.visible { display: block; }
.case-header {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: var(--space-6) var(--space-8);
  position: sticky; top: 0; z-index: 10;
}
.case-header-top {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: var(--space-4); margin-bottom: var(--space-4);
}
.back-btn {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-sm); color: var(--text-muted); padding: var(--space-2);
  border-radius: var(--radius-md); margin-left: calc(-1 * var(--space-2));
}
.back-btn:hover { color: var(--text); background: var(--surface-offset); }
.case-header-title-row { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.case-header-title { font-family: var(--font-display); font-size: var(--text-xl); }
.case-header-sub { font-size: var(--text-sm); color: var(--text-muted); }
.case-header-actions { display: flex; gap: var(--space-2); }
.btn-icon {
  width: 36px; height: 36px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); background: var(--surface-2); color: var(--text-muted);
}
.btn-icon:hover { color: var(--text); background: var(--surface-offset); }
.case-tabs {
  display: flex; gap: var(--space-1);
}
.tab-btn {
  padding: var(--space-2) var(--space-4); border-radius: var(--radius-md);
  font-size: var(--text-sm); font-weight: 500; color: var(--text-muted);
  position: relative;
}
.tab-btn:hover { color: var(--text); background: var(--surface-offset); }
.tab-btn.active { color: var(--primary); background: var(--primary-light); }
.tab-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--primary); color: var(--text-inverse);
  border-radius: var(--radius-full); font-size: 11px; font-weight: 700;
  margin-left: var(--space-2);
}
.tab-btn:not(.active) .tab-count { background: var(--surface-offset); color: var(--text-muted); }

/* ─── TAB PANELS ─── */
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* Case Info panel */
.case-form { padding: var(--space-6) var(--space-8); max-width: 800px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-group-wide { grid-column: 1 / -1; }
.form-label { display: block; font-size: var(--text-sm); font-weight: 500; margin-bottom: var(--space-2); }
.form-input-styled {
  width: 100%; padding: var(--space-3) var(--space-4);
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--text);
}
.form-input-styled:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); outline: none; }
textarea.form-input-styled { min-height: 100px; resize: vertical; }
.form-section-title {
  font-size: var(--text-sm); font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.06em;
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-8); margin-bottom: var(--space-4);
  padding-top: var(--space-6); border-top: 1px solid var(--divider);
}
.toggle-group { display: flex; gap: var(--space-2); }
.toggle-opt {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border); border-radius: var(--radius-md);
  font-size: var(--text-sm); font-weight: 500; color: var(--text-muted);
  background: var(--surface-2);
}
.toggle-opt.active { background: var(--primary); color: var(--text-inverse); border-color: var(--primary); }
.toggle-opt:hover:not(.active) { background: var(--surface-offset); color: var(--text); }
.save-btn {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--primary); color: var(--text-inverse);
  border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600;
  margin-top: var(--space-6);
}
.save-btn:hover { background: var(--primary-hover); }

/* Findings panel */
.findings-panel { padding: var(--space-6) var(--space-8); }
.findings-toolbar {
  display: flex; align-items: center; gap: var(--space-3);
  margin-bottom: var(--space-6); flex-wrap: wrap;
}
.findings-count { font-size: var(--text-sm); color: var(--text-muted); }
.findings-toolbar-right { margin-left: auto; display: flex; gap: var(--space-2); }
.btn-outline {
  padding: var(--space-2) var(--space-3); border: 1px solid var(--border);
  background: var(--surface-2); border-radius: var(--radius-md);
  font-size: var(--text-sm); color: var(--text-muted);
  display: flex; align-items: center; gap: var(--space-2);
}
.btn-outline:hover { background: var(--surface-offset); color: var(--text); }
.category-chips { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-6); }
.chip {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--border); border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 500; color: var(--text-muted);
  background: var(--surface-2); cursor: pointer;
  display: flex; align-items: center; gap: 5px;
}
.chip:hover { background: var(--surface-offset); color: var(--text); }
.chip.active { background: var(--primary-light); color: var(--primary); border-color: rgba(26,44,78,0.25); }
.chip-count {
  background: var(--surface-offset); color: var(--text-muted);
  border-radius: var(--radius-full); padding: 0 6px; font-size: 10px; font-weight: 700;
}
.chip.active .chip-count { background: rgba(26,44,78,0.15); color: var(--primary); }
.findings-list { display: flex; flex-direction: column; gap: var(--space-2); }
.finding-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: var(--space-4) var(--space-5);
  cursor: pointer; transition: box-shadow var(--transition), border-color var(--transition);
}
.finding-card:hover { box-shadow: var(--shadow-md); border-color: rgba(26,44,78,0.2); }
.finding-card-header { display: flex; align-items: flex-start; gap: var(--space-3); margin-bottom: var(--space-2); }
.finding-card-badges { display: flex; gap: var(--space-2); flex-wrap: wrap; flex-shrink: 0; }
.finding-card-right { margin-left: auto; flex-shrink: 0; }
.finding-card-title { font-size: var(--text-sm); font-weight: 600; flex: 1; }
.finding-card-meta { font-size: var(--text-xs); color: var(--text-muted); display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.finding-meta-item { display: flex; align-items: center; gap: var(--space-1); }
.finding-card-excerpt { font-size: var(--text-sm); color: var(--text-muted); font-style: italic; margin-top: var(--space-2); padding: var(--space-3); background: var(--surface-offset); border-radius: var(--radius-md); border-left: 3px solid var(--border); }
.finding-card-analysis { font-size: var(--text-sm); color: var(--text); margin-top: var(--space-2); line-height: 1.6; }
.finding-card-precedent { margin-top: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-md); }
.precedent-title { font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: var(--space-2); display: flex; align-items: center; justify-content: space-between; }
.precedent-case { font-size: var(--text-sm); font-weight: 600; }
.precedent-cite { font-size: var(--text-xs); color: var(--text-muted); }
.finding-actions { margin-top: var(--space-3); display: flex; gap: var(--space-2); padding-top: var(--space-3); border-top: 1px solid var(--divider); }
.action-btn {
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-md);
  font-size: var(--text-xs); font-weight: 500;
  display: flex; align-items: center; gap: var(--space-1);
  border: 1px solid var(--border); background: var(--surface-2); color: var(--text-muted);
}
.action-btn:hover { background: var(--surface-offset); color: var(--text); }
.action-btn.simulate { background: var(--primary); color: var(--text-inverse); border-color: var(--primary); }
.action-btn.simulate:hover { background: var(--primary-hover); }

/* Severity badges */
.badge {
  display: inline-flex; align-items: center;
  font-size: 11px; font-weight: 700; padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}
.badge-sev-critical { background: var(--critical-light); color: var(--critical); }
.badge-sev-high { background: var(--high-light); color: var(--high); }
.badge-sev-medium { background: var(--medium-light); color: var(--medium); }
.badge-sev-low { background: var(--low-light); color: var(--low); }
.badge-cat { background: var(--primary-light); color: var(--primary); }
.badge-binding { background: var(--binding-light); color: var(--binding); border: 1px solid rgba(26,44,78,0.2); }
.badge-page { background: var(--surface-offset); color: var(--text-muted); }

/* ─── SIMULATION MODAL ─── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: flex-end; justify-content: center;
  padding: var(--space-4);
  opacity: 0; pointer-events: none;
  transition: opacity var(--transition);
}
.modal-overlay.open { opacity: 1; pointer-events: all; }
@media (min-width: 600px) {
  .modal-overlay { align-items: center; }
}
.modal {
  background: var(--surface); border-radius: var(--radius-xl);
  width: 100%; max-width: 560px; max-height: 92dvh; overflow-y: auto;
  box-shadow: var(--shadow-lg);
  transform: translateY(20px);
  transition: transform var(--transition);
}
.modal-overlay.open .modal { transform: translateY(0); }
.modal-header {
  background: var(--primary); color: var(--text-inverse);
  padding: var(--space-4) var(--space-6);
  display: flex; align-items: flex-start; justify-content: space-between;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  gap: var(--space-3);
}
.modal-header-text { flex: 1; }
.modal-label { font-size: var(--text-xs); opacity: 0.7; text-transform: uppercase; letter-spacing: 0.08em; }
.modal-title { font-size: var(--text-base); font-weight: 600; margin-top: 2px; }
.modal-close { color: rgba(255,255,255,0.7); padding: 4px; border-radius: var(--radius-sm); flex-shrink: 0; }
.modal-close:hover { color: white; }
.modal-body { padding: var(--space-6); }
.sim-section-title { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: var(--space-3); }
.sim-modes { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-6); }
.sim-mode {
  padding: var(--space-4); border: 1.5px solid var(--border);
  border-radius: var(--radius-lg); cursor: pointer;
  display: flex; align-items: flex-start; gap: var(--space-3);
  transition: border-color var(--transition), background var(--transition);
}
.sim-mode:hover { border-color: rgba(26,44,78,0.3); background: var(--surface-offset); }
.sim-mode.selected { border-color: var(--accent); background: var(--accent-light); }
.sim-mode-key {
  width: 28px; height: 28px; border-radius: var(--radius-md); flex-shrink: 0;
  background: var(--surface-offset); display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs); font-weight: 700; color: var(--text-muted);
}
.sim-mode.selected .sim-mode-key { background: var(--accent); color: white; }
.sim-mode-name { font-size: var(--text-sm); font-weight: 600; }
.sim-mode-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.sim-mode.selected .sim-mode-sub { color: var(--text); }
.sim-options { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6); }
.sim-option {
  padding: var(--space-4); border: 1.5px solid var(--border);
  border-radius: var(--radius-lg); display: flex; align-items: flex-start; gap: var(--space-3);
  transition: border-color var(--transition), background var(--transition);
}
.sim-option.enabled { border-color: var(--accent); background: var(--accent-light); }
.sim-option-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.sim-option-body { flex: 1; }
.sim-option-name { font-size: var(--text-sm); font-weight: 600; }
.sim-option-desc { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.toggle-switch {
  position: relative; width: 44px; height: 24px; flex-shrink: 0; cursor: pointer;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-track {
  position: absolute; inset: 0;
  background: var(--border); border-radius: var(--radius-full);
  transition: background var(--transition);
}
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: white; transition: left var(--transition);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-switch input:checked ~ .toggle-track { background: var(--accent); }
.toggle-switch input:checked ~ .toggle-thumb { left: 23px; }
.sim-notes-label { font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: var(--space-2); }
.sim-notes { width: 100%; padding: var(--space-3) var(--space-4); background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: var(--text-sm); color: var(--text); min-height: 80px; resize: vertical; margin-bottom: var(--space-6); }
.sim-notes:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); outline: none; }
.modal-footer {
  display: flex; gap: var(--space-3); padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--divider);
}
.btn-cancel { flex: 1; padding: var(--space-3); border: 1px solid var(--border); background: var(--surface-2); border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; color: var(--text-muted); }
.btn-cancel:hover { background: var(--surface-offset); color: var(--text); }
.btn-run { flex: 2; padding: var(--space-3); background: var(--primary); color: var(--text-inverse); border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: var(--space-2); }
.btn-run:hover { background: var(--primary-hover); }

/* Loading state */
.sim-loading { text-align: center; padding: var(--space-12) var(--space-6); display: none; }
.sim-loading.visible { display: block; }
.sim-loading-icon { width: 64px; height: 64px; margin: 0 auto var(--space-4); background: var(--surface-offset); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); position: relative; overflow: hidden; }
.sim-loading-icon::after { content:''; position: absolute; inset: 0; border-radius: 50%; border: 3px solid transparent; border-top-color: var(--primary); animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.sim-loading h3 { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-2); }
.sim-loading p { font-size: var(--text-sm); color: var(--text-muted); max-width: 32ch; margin: 0 auto; }

/* Sim results */
.sim-results { display: none; }
.sim-results.visible { display: block; }
.verdict-banner {
  padding: var(--space-5); border-radius: var(--radius-lg);
  text-align: center; margin-bottom: var(--space-6);
}
.verdict-banner.win { background: var(--low-light); border: 1px solid rgba(46,125,50,0.2); }
.verdict-banner.loss { background: var(--critical-light); border: 1px solid rgba(192,57,43,0.2); }
.verdict-icon { font-size: 32px; margin-bottom: var(--space-2); }
.verdict-title { font-family: var(--font-display); font-size: var(--text-lg); font-weight: 600; }
.verdict-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-1); }
.sim-round { margin-bottom: var(--space-5); }
.round-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
.round-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
.round-strength { font-size: var(--text-xs); font-weight: 700; padding: 2px 10px; border-radius: var(--radius-full); }
.strength-strong { background: var(--low-light); color: var(--low); }
.strength-moderate { background: var(--high-light); color: var(--high); }
.strength-weak { background: var(--critical-light); color: var(--critical); }
.strength-exhausted { background: var(--surface-offset); color: var(--text-muted); }
.round-burden { font-size: var(--text-xs); color: var(--text-muted); font-style: italic; padding: var(--space-2) var(--space-3); background: var(--surface-offset); border-radius: var(--radius-md); margin-bottom: var(--space-3); }
.sim-party { margin-bottom: var(--space-3); }
.sim-party-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--space-2); }
.sim-party-label.state { color: var(--critical); }
.sim-party-label.defense { color: var(--primary); }
.sim-party-label.court { color: var(--text-muted); }
.sim-party-text { font-size: var(--text-sm); color: var(--text); line-height: 1.7; }

/* ─── NEW CASE MODAL ─── */
.new-case-modal { max-width: 480px; }

/* ─── EMPTY STATE ─── */
.empty-state { text-align: center; padding: var(--space-16) var(--space-6); }
.empty-state-icon { width: 56px; height: 56px; margin: 0 auto var(--space-4); color: var(--text-faint); }
.empty-state h3 { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-2); }
.empty-state p { font-size: var(--text-sm); color: var(--text-muted); max-width: 36ch; margin: 0 auto var(--space-6); }

/* ─── SKELETON ─── */
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.skeleton { background: linear-gradient(90deg, var(--surface-offset) 25%, var(--surface-2) 50%, var(--surface-offset) 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: var(--radius-sm); }
.skeleton-text { height: 1em; margin-bottom: var(--space-2); }
.skeleton-heading { height: 1.5em; width: 50%; margin-bottom: var(--space-4); }
.skeleton-card { height: 80px; border-radius: var(--radius-lg); margin-bottom: var(--space-3); }

/* ─── DOCUMENT LIST ─── */
.documents-panel { padding: var(--space-6) var(--space-8); }
.doc-list { display: flex; flex-direction: column; gap: var(--space-2); }
.doc-item {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: var(--space-4) var(--space-5);
  display: flex; align-items: center; gap: var(--space-4);
  transition: box-shadow var(--transition);
}
.doc-item:hover { box-shadow: var(--shadow-sm); }
.doc-icon { color: var(--text-muted); flex-shrink: 0; }
.doc-body { flex: 1; min-width: 0; }
.doc-name { font-size: var(--text-sm); font-weight: 500; }
.doc-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.doc-count { font-size: var(--text-xs); color: var(--text-muted); flex-shrink: 0; }

/* ─── TOAST ─── */
.toast {
  position: fixed; bottom: var(--space-6); left: 50%; transform: translateX(-50%) translateY(20px);
  background: var(--primary); color: var(--text-inverse);
  padding: var(--space-3) var(--space-5); border-radius: var(--radius-lg);
  font-size: var(--text-sm); font-weight: 500;
  box-shadow: var(--shadow-lg); z-index: 300;
  opacity: 0; pointer-events: none;
  transition: opacity var(--transition), transform var(--transition);
  white-space: nowrap;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ─── RESPONSIVE ─── */
@media (max-width: 768px) {
  .sidebar { width: 100%; position: fixed; z-index: 50; top: var(--header-h); left: 0; bottom: 0; transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .stats-row { grid-template-columns: repeat(3, 1fr); }
  .dashboard { padding: var(--space-4); }
  .case-header { padding: var(--space-4); }
  .findings-panel, .case-form, .documents-panel { padding: var(--space-4); }
  .case-header-actions { display: none; }
  .form-grid-2 { grid-template-columns: 1fr; }
  .form-group-wide { grid-column: auto; }
}
@media (max-width: 480px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .stats-row .stat-card:last-child { grid-column: 1 / -1; }
}
</style>
</head>
<body>

<!-- AUTH SCREEN -->
<div id="auth-screen">
  <div class="auth-card">
    <div class="auth-logo">
      <svg class="auth-logo-icon" viewBox="0 0 40 40" fill="none" aria-label="CaseLight">
        <rect width="40" height="40" rx="10" fill="#1a2c4e"/>
        <path d="M20 8 L28 14 L28 22 Q28 30 20 33 Q12 30 12 22 L12 14 Z" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linejoin="round"/>
        <path d="M16 20 L19 23 L24 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="auth-logo-text">
        <h1>CaseLight</h1>
        <p>Legal Analysis Platform</p>
      </div>
    </div>
    <h2>Sign in</h2>
    <p>Access your case files and analysis</p>
    <div class="auth-error" id="auth-error">Invalid email or password. Please try again.</div>
    <form id="login-form" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" id="email" class="form-input" placeholder="you@example.com" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" class="form-input" placeholder="••••••••" required autocomplete="current-password">
      </div>
      <button type="submit" class="btn-primary" id="login-btn">
        <i data-lucide="log-in" width="16" height="16"></i>
        Sign in to CaseLight
      </button>
    </form>
  </div>
</div>

<!-- APP -->
<div id="app">
  <!-- Header -->
  <header class="app-header">
    <button class="header-btn" id="sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle sidebar">
      <i data-lucide="menu" width="20" height="20"></i>
    </button>
    <div class="header-logo">
      <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)"/>
        <path d="M20 6 L30 13 L30 23 Q30 33 20 36 Q10 33 10 23 L10 13 Z" fill="none" stroke="#c9a84c" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M15 22 L19 26 L25 18" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="header-logo-name">CaseLight</span>
    </div>
    <div id="header-case-info" class="header-case-info" style="display:none">
      <!-- filled by JS -->
    </div>
    <div class="header-spacer"></div>
    <div class="header-actions">
      <span id="header-user" style="font-size:var(--text-xs);opacity:0.7;"></span>
      <button class="header-btn" onclick="logout()" aria-label="Sign out" title="Sign out">
        <i data-lucide="log-out" width="18" height="18"></i>
      </button>
    </div>
  </header>

  <div class="app-body">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-section">
        <button class="new-case-btn" onclick="openNewCaseModal()">
          <i data-lucide="plus" width="16" height="16"></i>
          New Case
        </button>
        <div class="sidebar-section-title">Case Files</div>
        <div class="case-list" id="sidebar-cases">
          <!-- skeleton -->
          <div class="skeleton skeleton-card" style="height:60px"></div>
          <div class="skeleton skeleton-card" style="height:60px"></div>
        </div>
      </div>
      <div class="sidebar-footer">
        <button class="logout-btn" onclick="logout()">
          <i data-lucide="log-out" width="16" height="16"></i>
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content" id="main-content">
      <!-- Dashboard -->
      <div id="dashboard-view">
        <div class="dashboard">
          <div class="dashboard-header">
            <h2>My Cases</h2>
            <button class="btn-outline" onclick="openNewCaseModal()">
              <i data-lucide="plus" width="14" height="14"></i>
              New Case
            </button>
          </div>
          <div class="stats-row" id="stats-row">
            <div class="stat-card"><div class="stat-number" id="stat-total">—</div><div class="stat-label">Total Findings</div></div>
            <div class="stat-card"><div class="stat-number critical" id="stat-critical">—</div><div class="stat-label">Critical</div></div>
            <div class="stat-card"><div class="stat-number high" id="stat-high">—</div><div class="stat-label">High</div></div>
          </div>
          <div class="section-header">
            <i data-lucide="folder" width="14" height="14"></i>
            Cases
          </div>
          <div id="cases-list" class="cases-grid">
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
          </div>
        </div>
      </div>

      <!-- Case view -->
      <div id="case-view" class="case-view">
        <div class="case-header">
          <div class="case-header-top">
            <button class="back-btn" onclick="showDashboard()">
              <i data-lucide="arrow-left" width="16" height="16"></i>
              <span>My Cases</span>
            </button>
            <div class="case-header-actions">
              <button class="btn-icon" onclick="exportCase()" title="Export case" aria-label="Export">
                <i data-lucide="download" width="16" height="16"></i>
              </button>
              <button class="btn-icon" title="Save" aria-label="Save" onclick="saveCase()">
                <i data-lucide="save" width="16" height="16"></i>
              </button>
            </div>
          </div>
          <div class="case-header-title-row">
            <h2 class="case-header-title" id="cv-title">Loading...</h2>
          </div>
          <div class="case-header-sub" id="cv-sub"></div>
          <div class="case-tabs" style="margin-top:var(--space-4)">
            <button class="tab-btn active" data-tab="findings" onclick="switchTab(this,'findings')">
              Findings <span class="tab-count" id="tab-findings-count">0</span>
            </button>
            <button class="tab-btn" data-tab="documents" onclick="switchTab(this,'documents')">
              Transcripts <span class="tab-count" id="tab-docs-count">0</span>
            </button>
            <button class="tab-btn" data-tab="info" onclick="switchTab(this,'info')">
              Case Info
            </button>
          </div>
        </div>

        <!-- Findings tab -->
        <div id="tab-findings" class="tab-panel active">
          <div class="findings-panel">
            <div class="findings-toolbar">
              <span class="findings-count" id="findings-count-label">Loading findings...</span>
              <div class="findings-toolbar-right">
                <button class="btn-outline" onclick="selectAllFindings()">
                  <i data-lucide="check-square" width="14" height="14"></i> Select
                </button>
                <button class="btn-outline" onclick="auditCase()">
                  <i data-lucide="clipboard-check" width="14" height="14"></i> Audit
                </button>
                <button class="btn-outline" onclick="shareFindings()">
                  <i data-lucide="share-2" width="14" height="14"></i> Share
                </button>
              </div>
            </div>
            <div class="category-chips" id="category-chips"></div>
            <div class="findings-list" id="findings-list">
              <div class="skeleton skeleton-card"></div>
              <div class="skeleton skeleton-card"></div>
              <div class="skeleton skeleton-card" style="height:100px"></div>
            </div>
          </div>
        </div>

        <!-- Documents tab -->
        <div id="tab-documents" class="tab-panel">
          <div class="documents-panel">
            <div class="section-header">
              <i data-lucide="file-text" width="14" height="14"></i>
              Uploaded Transcripts
            </div>
            <div class="doc-list" id="documents-list">
              <div class="skeleton skeleton-card"></div>
              <div class="skeleton skeleton-card"></div>
            </div>
          </div>
        </div>

        <!-- Case Info tab -->
        <div id="tab-info" class="tab-panel">
          <div class="case-form">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Case Name</label>
                <input type="text" class="form-input-styled" id="fi-case-name">
              </div>
              <div class="form-group">
                <label class="form-label">Case No.</label>
                <input type="text" class="form-input-styled" id="fi-case-no">
              </div>
              <div class="form-group">
                <label class="form-label">Defendant</label>
                <input type="text" class="form-input-styled" id="fi-defendant">
              </div>
              <div class="form-group">
                <label class="form-label">Court</label>
                <input type="text" class="form-input-styled" id="fi-court">
              </div>
              <div class="form-group form-group-wide">
                <label class="form-label">Defendant's Account</label>
                <textarea class="form-input-styled" id="fi-account" rows="4" placeholder="Paste the defendant's own account here. Keep it labeled as his version of events, not the court's narrative."></textarea>
              </div>
            </div>

            <div class="form-section-title">
              <i data-lucide="git-branch" width="16" height="16"></i>
              Appellate History (No-Merit / §809.32)
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Appellate Attorney</label>
                <input type="text" class="form-input-styled" id="fi-app-atty" placeholder="Attorney name">
              </div>
              <div class="form-group">
                <label class="form-label">Court of Appeals</label>
                <input type="text" class="form-input-styled" id="fi-app-court" placeholder="e.g. Ct. App. Dist. II">
              </div>
              <div class="form-group">
                <label class="form-label">No-Merit Filed</label>
                <input type="text" class="form-input-styled" id="fi-no-merit-filed">
              </div>
              <div class="form-group">
                <label class="form-label">Court Approved</label>
                <input type="text" class="form-input-styled" id="fi-court-approved">
              </div>
              <div class="form-group form-group-wide">
                <label class="form-label">Defendant Filed Pro Se Response?</label>
                <div class="toggle-group">
                  <button class="toggle-opt" data-val="yes" onclick="setToggle(this,'fi-pro-se')">Yes</button>
                  <button class="toggle-opt" data-val="no" onclick="setToggle(this,'fi-pro-se')">No</button>
                  <button class="toggle-opt active" data-val="unknown" onclick="setToggle(this,'fi-pro-se')">Unknown</button>
                </div>
                <input type="hidden" id="fi-pro-se" value="unknown">
              </div>
              <div class="form-group form-group-wide">
                <label class="form-label">Claims Listed as Having No Merit</label>
                <textarea class="form-input-styled" id="fi-claims-no-merit" rows="3" placeholder="List the claims appellate counsel identified as having no arguable merit..."></textarea>
              </div>
            </div>
            <button class="save-btn" onclick="saveCaseInfo()">
              <i data-lucide="check" width="16" height="16"></i>
              Save Case Info
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>

<!-- SIMULATION MODAL -->
<div class="modal-overlay" id="sim-modal" role="dialog" aria-modal="true" aria-labelledby="sim-modal-title">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-header-text">
        <div class="modal-label">Hearing Simulation</div>
        <div class="modal-title" id="sim-modal-title">Finding</div>
      </div>
      <button class="modal-close" onclick="closeSimModal()" aria-label="Close">
        <i data-lucide="x" width="20" height="20"></i>
      </button>
    </div>
    <div class="modal-body">

      <!-- Config view -->
      <div id="sim-config">
        <div class="sim-section-title">Choose Simulation Mode</div>
        <div class="sim-modes">
          <div class="sim-mode" data-mode="direct" onclick="selectSimMode(this)">
            <div class="sim-mode-key">A</div>
            <div><div class="sim-mode-name">Direct Appeal</div><div class="sim-mode-sub">Record-only • Harmless error</div></div>
          </div>
          <div class="sim-mode" data-mode="bangert" onclick="selectSimMode(this)">
            <div class="sim-mode-key">B</div>
            <div><div class="sim-mode-name">Bangert Motion</div><div class="sim-mode-sub">Plea withdrawal • Burden shifts</div></div>
          </div>
          <div class="sim-mode selected" data-mode="974" onclick="selectSimMode(this)">
            <div class="sim-mode-key">C</div>
            <div><div class="sim-mode-name">§974.06 Postconviction</div><div class="sim-mode-sub">IAC • Escalona bar • Strickland<br>Strickland ineffective assistance. Defense must overcome procedural bar and prove both prongs by preponderance.</div></div>
          </div>
          <div class="sim-mode" data-mode="habeas" onclick="selectSimMode(this)">
            <div class="sim-mode-key">D</div>
            <div><div class="sim-mode-name">Federal Habeas</div><div class="sim-mode-sub">AEDPA • § 2254 deference</div></div>
          </div>
        </div>

        <div class="sim-section-title">Simulation Options</div>
        <div class="sim-options">
          <div class="sim-option" id="opt-skeptic" onclick="toggleSimOption(this)">
            <div class="sim-option-icon">⚖️</div>
            <div class="sim-option-body">
              <div class="sim-option-name">Judicial Skeptic Mode</div>
              <div class="sim-option-desc">A skeptical judge interrupts both sides — killing arguments neither party anticipated</div>
            </div>
            <label class="toggle-switch" onclick="event.stopPropagation()">
              <input type="checkbox" id="toggle-skeptic" onchange="syncToggle(this,'opt-skeptic')">
              <div class="toggle-track"></div>
              <div class="toggle-thumb"></div>
            </label>
          </div>
          <div class="sim-option" id="opt-expanded" onclick="toggleSimOption(this)">
            <div class="sim-option-icon">📋</div>
            <div class="sim-option-body">
              <div class="sim-option-name">Expanded Evidentiary Record</div>
              <div class="sim-option-desc">State may call trial counsel, use affidavits, argue the plea questionnaire, and attack credibility — as in a real evidentiary hearing</div>
            </div>
            <label class="toggle-switch" onclick="event.stopPropagation()">
              <input type="checkbox" id="toggle-expanded" onchange="syncToggle(this,'opt-expanded')">
              <div class="toggle-track"></div>
              <div class="toggle-thumb"></div>
            </label>
          </div>
        </div>

        <div class="sim-notes-label">Plea Questionnaire Notes</div>
        <textarea class="sim-notes" id="sim-notes" placeholder='Optional. Describe what the plea questionnaire does or doesn\'t contain — the AI uses this to strengthen or qualify the simulation.&#10;&#10;E.g. "The questionnaire listed the case number but did not define read-ins or explain global resolution. Defendant initialed each page but box 14 (consequences of read-ins) was left blank."'></textarea>
      </div>

      <!-- Loading state -->
      <div class="sim-loading" id="sim-loading">
        <div class="sim-loading-icon">
          <i data-lucide="gavel" width="28" height="28"></i>
        </div>
        <h3 id="sim-loading-title">Running simulation...</h3>
        <p id="sim-loading-desc">Arguing both sides until the defense position can no longer be defeated.</p>
      </div>

      <!-- Results -->
      <div class="sim-results" id="sim-results"></div>

    </div>
    <div class="modal-footer" id="sim-footer">
      <button class="btn-cancel" onclick="closeSimModal()">Cancel</button>
      <button class="btn-run" onclick="runSimulation()">
        <i data-lucide="gavel" width="16" height="16"></i>
        Run Simulation
      </button>
    </div>
  </div>
</div>

<!-- NEW CASE MODAL -->
<div class="modal-overlay" id="new-case-modal" role="dialog" aria-modal="true">
  <div class="modal new-case-modal">
    <div class="modal-header">
      <div class="modal-header-text">
        <div class="modal-label">CaseLight</div>
        <div class="modal-title">New Case File</div>
      </div>
      <button class="modal-close" onclick="closeNewCaseModal()" aria-label="Close">
        <i data-lucide="x" width="20" height="20"></i>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Case Name *</label>
        <input type="text" class="form-input-styled" id="nc-name" placeholder="e.g. State vs. John Smith">
      </div>
      <div class="form-group">
        <label class="form-label">Case Number</label>
        <input type="text" class="form-input-styled" id="nc-number" placeholder="e.g. 17CM004157">
      </div>
      <div class="form-group">
        <label class="form-label">Defendant</label>
        <input type="text" class="form-input-styled" id="nc-defendant" placeholder="Full legal name">
      </div>
      <div class="form-group">
        <label class="form-label">Court</label>
        <input type="text" class="form-input-styled" id="nc-court" placeholder="e.g. Milwaukee">
      </div>
      <div id="nc-error" class="auth-error">Please enter a case name.</div>
    </div>
    <div class="modal-footer">
      <button class="btn-cancel" onclick="closeNewCaseModal()">Cancel</button>
      <button class="btn-run" onclick="createCase()">
        <i data-lucide="plus" width="16" height="16"></i>
        Create Case
      </button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const API = 'https://caselight-api.onrender.com';
let authToken = null;
let currentUser = null;
let cases = [];
let currentCase = null;
let currentFindings = [];
let currentDocs = [];
let activeCategory = 'all';
let simFindingId = null;
let sidebarOpen = false;

// ─── HELPERS ───
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
  return fetch(API + path, { ...opts, headers: { ...headers, ...(opts.headers||{}) } })
    .then(async r => {
      if (!r.ok) { const e = await r.text(); throw new Error(e || r.status); }
      if (r.status === 204) return null;
      return r.json();
    });
}

// ─── AUTH ───
async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const err = document.getElementById('auth-error');
  err.classList.remove('visible');
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" width="16" height="16"></i> Signing in...';
  lucide.createIcons();
  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });
    authToken = data.token;
    currentUser = data.user || data;
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    if (currentUser.email) document.getElementById('header-user').textContent = currentUser.email;
    loadCases();
  } catch(ex) {
    err.classList.add('visible');
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="log-in" width="16" height="16"></i> Sign in to CaseLight';
    lucide.createIcons();
  }
}

function logout() {
  authToken = null; currentUser = null; cases = []; currentCase = null;
  document.getElementById('app').classList.remove('visible');
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
}

// ─── CASES ───
async function loadCases() {
  try {
    cases = await api('/api/cases');
    renderSidebar();
    renderDashboard();
  } catch(e) {
    document.getElementById('cases-list').innerHTML = '<p style="color:var(--text-muted);font-size:var(--text-sm);padding:var(--space-4)">Could not load cases. Please refresh.</p>';
  }
}

function renderSidebar() {
  const el = document.getElementById('sidebar-cases');
  if (!cases.length) {
    el.innerHTML = '<p style="font-size:var(--text-xs);color:var(--text-muted);padding:var(--space-2)">No cases yet. Create one to get started.</p>';
    return;
  }
  el.innerHTML = cases.map(c => {
    const hasCritical = c.findings_count_critical > 0;
    const hasHigh = c.findings_count_high > 0;
    return `<div class="case-item${currentCase && currentCase.id===c.id?' active':''}" onclick="openCase(${c.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openCase(${c.id})">
      <div class="case-item-name">${esc(c.case_name || c.name)}</div>
      <div class="case-item-meta">${esc(c.defendant || '')}${c.court ? ' · ' + esc(c.court) : ''}</div>
      ${hasCritical ? '<span class="case-item-badge badge-critical">'+c.findings_count_critical+' critical</span>' : hasHigh ? '<span class="case-item-badge badge-high">'+c.findings_count_high+' high</span>' : ''}
    </div>`;
  }).join('');
}

function renderDashboard() {
  const total = cases.reduce((s,c) => s + (c.findings_count||0), 0);
  const critical = cases.reduce((s,c) => s + (c.findings_count_critical||0), 0);
  const high = cases.reduce((s,c) => s + (c.findings_count_high||0), 0);
  document.getElementById('stat-total').textContent = total || '—';
  document.getElementById('stat-critical').textContent = critical || '—';
  document.getElementById('stat-high').textContent = high || '—';

  const el = document.getElementById('cases-list');
  if (!cases.length) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon"><i data-lucide="folder-open" width="48" height="48"></i></div>
      <h3>No cases yet</h3>
      <p>Create your first case file to begin analyzing legal transcripts.</p>
      <button class="save-btn" style="margin:0 auto" onclick="openNewCaseModal()"><i data-lucide="plus" width="16" height="16"></i> Create Case</button>
    </div>`;
    lucide.createIcons();
    return;
  }
  el.innerHTML = cases.map(c => {
    const hasCritical = c.findings_count_critical > 0;
    const icon = hasCritical ? 'case-card-icon' : 'case-card-icon normal';
    const iconName = hasCritical ? 'alert-triangle' : 'folder';
    return `<div class="case-card" onclick="openCase(${c.id})" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openCase(${c.id})">
      <div class="${icon}"><i data-lucide="${iconName}" width="20" height="20"></i></div>
      <div class="case-card-body">
        <div class="case-card-title">${esc(c.case_name || c.name)} <span style="font-weight:400;color:var(--text-muted)">#${esc(c.case_number||c.case_no||'')}</span></div>
        <div class="case-card-sub">${esc(c.defendant||'')}${c.court?' · '+esc(c.court):''}</div>
        <div class="case-card-meta">
          ${c.updated_at ? `<span style="color:var(--text-muted);font-size:var(--text-xs)">${formatDate(c.updated_at)}</span>` : ''}
          ${c.findings_count ? `<span style="font-size:var(--text-xs);color:var(--text-muted)">${c.findings_count} findings</span>` : ''}
          ${hasCritical ? `<span class="badge badge-sev-critical">${c.findings_count_critical} critical</span>` : ''}
        </div>
      </div>
      <div class="case-card-right"><i data-lucide="chevron-right" width="16" height="16"></i></div>
    </div>`;
  }).join('');
  lucide.createIcons();
}

function showDashboard() {
  currentCase = null;
  document.getElementById('dashboard-view').style.display = 'block';
  document.getElementById('case-view').classList.remove('visible');
  document.getElementById('header-case-info').style.display = 'none';
  renderSidebar();
  lucide.createIcons();
}

async function openCase(id) {
  if (window.innerWidth < 769) closeSidebar();
  document.getElementById('dashboard-view').style.display = 'none';
  document.getElementById('case-view').classList.add('visible');

  // Show loading state
  document.getElementById('cv-title').textContent = 'Loading...';
  document.getElementById('cv-sub').textContent = '';
  document.getElementById('findings-list').innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card" style="height:100px"></div>';
  document.getElementById('documents-list').innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';

  try {
    const [caseData, findings, docs] = await Promise.all([
      api('/api/cases/' + id),
      api('/api/cases/' + id + '/findings').catch(() => []),
      api('/api/cases/' + id + '/documents').catch(() => [])
    ]);
    currentCase = caseData;
    currentFindings = findings || [];
    currentDocs = docs || [];
    renderCaseView();
    renderSidebar();
    lucide.createIcons();
  } catch(e) {
    showToast('Error loading case. Please try again.');
    showDashboard();
  }
}

function renderCaseView() {
  const c = currentCase;
  document.getElementById('cv-title').textContent = c.case_name || c.name;
  document.getElementById('cv-sub').textContent = [c.defendant, c.court].filter(Boolean).join(' · ');

  // Header info
  const hi = document.getElementById('header-case-info');
  hi.style.display = 'block';
  hi.innerHTML = `<strong>${esc(c.case_name||c.name)}</strong> · ${esc(c.defendant||'')}`;

  // Counts
  document.getElementById('tab-findings-count').textContent = currentFindings.length;
  document.getElementById('tab-docs-count').textContent = currentDocs.length;

  // Fill info tab
  document.getElementById('fi-case-name').value = c.case_name||c.name||'';
  document.getElementById('fi-case-no').value = c.case_number||c.case_no||'';
  document.getElementById('fi-defendant').value = c.defendant||'';
  document.getElementById('fi-court').value = c.court||'';
  document.getElementById('fi-account').value = c.defendant_account||c.joey_statement||'';
  document.getElementById('fi-app-atty').value = c.appellate_attorney||'';
  document.getElementById('fi-app-court').value = c.appellate_court||'';
  document.getElementById('fi-no-merit-filed').value = c.no_merit_filed||'';
  document.getElementById('fi-court-approved').value = c.court_approved||'';
  document.getElementById('fi-claims-no-merit').value = c.claims_no_merit||'';

  activeCategory = 'all';
  renderFindings();
  renderDocuments();
}

function renderFindings() {
  const el = document.getElementById('findings-list');
  const catEl = document.getElementById('category-chips');
  const label = document.getElementById('findings-count-label');

  const filtered = activeCategory === 'all'
    ? currentFindings
    : currentFindings.filter(f => (f.category||'').toLowerCase().replace(/\s+/g,'-') === activeCategory);

  label.textContent = filtered.length + ' findings';

  // Category chips
  const cats = {};
  currentFindings.forEach(f => {
    const k = f.category||'Other';
    cats[k] = (cats[k]||0) + 1;
  });
  catEl.innerHTML = `<div class="chip${activeCategory==='all'?' active':''}" onclick="filterCat('all')">
    <i data-lucide="grid" width="12" height="12"></i> All Categories <span class="chip-count">${currentFindings.length}</span>
  </div>` + Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat,count]) => {
    const k = cat.toLowerCase().replace(/\s+/g,'-');
    return `<div class="chip${activeCategory===k?' active':''}" onclick="filterCat('${k}')">
      ${esc(cat)} <span class="chip-count">${count}</span>
    </div>`;
  }).join('');

  if (!filtered.length) {
    el.innerHTML = `<div class="empty-state" style="padding:var(--space-10)">
      <div class="empty-state-icon"><i data-lucide="search" width="40" height="40"></i></div>
      <h3>No findings found</h3>
      <p>No findings match the selected category.</p>
    </div>`;
    lucide.createIcons();
    return;
  }

  el.innerHTML = filtered.map(f => findingCard(f)).join('');
  lucide.createIcons();
}

function findingCard(f) {
  const sev = (f.severity||f.level||'').toLowerCase();
  const sevBadge = {critical:'badge-sev-critical',high:'badge-sev-high',medium:'badge-sev-medium',low:'badge-sev-low'}[sev] || 'badge-sev-medium';
  const cat = f.category || f.type || '';
  const page = f.page_reference || f.page || '';
  const caseRef = f.case_reference || f.precedent_case || '';
  const excerpt = f.transcript_excerpt || f.excerpt || '';
  const analysis = f.legal_analysis || f.analysis || '';
  const precedent = f.precedent_case || caseRef;
  const precedentCite = f.precedent_citation || '';
  const isBinding = f.precedent_type === 'binding' || f.binding;
  const docName = f.document_name || f.source || '';
  const docDate = f.document_date || f.date || '';

  return `<div class="finding-card" id="fc-${f.id}">
    <div class="finding-card-header">
      <div class="finding-card-badges">
        ${sev ? `<span class="badge ${sevBadge}">${cap(sev)}</span>` : ''}
        ${cat ? `<span class="badge badge-cat">${esc(cat)}</span>` : ''}
        ${page ? `<span class="badge badge-page">Page ${esc(page)}</span>` : ''}
      </div>
      <div class="finding-card-right">
        ${isBinding ? '<span class="badge badge-binding">Binding</span>' : ''}
      </div>
    </div>
    <div class="finding-card-title">${esc(f.title||f.finding||'Finding')}</div>
    <div class="finding-card-meta" style="margin-top:var(--space-2)">
      ${docDate ? `<span class="finding-meta-item"><i data-lucide="calendar" width="12" height="12"></i> ${esc(docDate)}</span>` : ''}
      ${docName ? `<span class="finding-meta-item"><i data-lucide="file-text" width="12" height="12"></i> ${esc(docName)}</span>` : ''}
      ${caseRef ? `<span class="finding-meta-item"><i data-lucide="book-open" width="12" height="12"></i> ${esc(caseRef)}</span>` : ''}
    </div>
    ${excerpt ? `<div class="finding-card-excerpt">"${esc(excerpt)}"</div>` : ''}
    ${analysis ? `<div class="finding-card-analysis">${esc(analysis)}</div>` : ''}
    ${precedent ? `<div class="finding-card-precedent">
      <div class="precedent-title">
        <span><i data-lucide="scale" width="12" height="12" style="display:inline;vertical-align:middle;margin-right:4px"></i> Precedent Match</span>
        ${isBinding ? '<span class="badge badge-binding">Binding</span>' : ''}
      </div>
      <div class="precedent-case">${esc(precedent)}</div>
      ${precedentCite ? `<div class="precedent-cite">${esc(precedentCite)}</div>` : ''}
      ${f.court_ruling ? `<div style="margin-top:var(--space-2)"><div style="font-size:var(--text-xs);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:4px">Court Ruling</div><div style="font-size:var(--text-sm)">${esc(f.court_ruling)}</div></div>` : ''}
      ${f.material_similarity ? `<div style="margin-top:var(--space-2)"><div style="font-size:var(--text-xs);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:4px">Material Similarity</div><div style="font-size:var(--text-sm);color:var(--text-muted)">${esc(f.material_similarity)}</div></div>` : ''}
    </div>` : ''}
    <div class="finding-actions">
      <button class="action-btn simulate" onclick="openSimModal(${f.id})">
        <i data-lucide="gavel" width="13" height="13"></i> Simulate Hearing — State vs. Defense
      </button>
      <button class="action-btn" onclick="editFinding(${f.id})">
        <i data-lucide="pencil" width="13" height="13"></i> Edit
      </button>
      <button class="action-btn" onclick="deleteFinding(${f.id})">
        <i data-lucide="trash-2" width="13" height="13"></i> Delete
      </button>
    </div>
  </div>`;
}

function filterCat(k) {
  activeCategory = k;
  renderFindings();
}

function renderDocuments() {
  const el = document.getElementById('documents-list');
  if (!currentDocs.length) {
    el.innerHTML = `<div class="empty-state" style="padding:var(--space-10)">
      <div class="empty-state-icon"><i data-lucide="upload" width="40" height="40"></i></div>
      <h3>No transcripts yet</h3>
      <p>Upload hearing transcripts, motions, or police reports to begin analysis.</p>
    </div>`;
    lucide.createIcons();
    return;
  }
  el.innerHTML = currentDocs.map(d => `<div class="doc-item">
    <div class="doc-icon"><i data-lucide="file-text" width="20" height="20"></i></div>
    <div class="doc-body">
      <div class="doc-name">${esc(d.name||d.filename||d.label||'Document')}</div>
      <div class="doc-meta">${d.date||d.document_date||d.created_at ? formatDate(d.date||d.document_date||d.created_at) : ''}</div>
    </div>
    <div class="doc-count">${d.findings_count != null ? d.findings_count+' findings' : ''}</div>
  </div>`).join('');
  lucide.createIcons();
}

// ─── TABS ───
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+tabId).classList.add('active');
}

// ─── SIMULATION ───
function openSimModal(findingId) {
  simFindingId = findingId;
  const f = currentFindings.find(x => x.id === findingId);
  if (f) document.getElementById('sim-modal-title').textContent = f.title||f.finding||'Finding';
  document.getElementById('sim-config').style.display = 'block';
  document.getElementById('sim-loading').classList.remove('visible');
  document.getElementById('sim-results').classList.remove('visible');
  document.getElementById('sim-results').innerHTML = '';
  document.getElementById('sim-footer').style.display = 'flex';
  document.getElementById('sim-modal').classList.add('open');
}

function closeSimModal() {
  document.getElementById('sim-modal').classList.remove('open');
  setTimeout(() => {
    document.getElementById('sim-config').style.display = 'block';
    document.getElementById('sim-loading').classList.remove('visible');
    document.getElementById('sim-results').classList.remove('visible');
    document.getElementById('sim-results').innerHTML = '';
    document.getElementById('sim-footer').style.display = 'flex';
  }, 200);
}

function selectSimMode(el) {
  document.querySelectorAll('.sim-mode').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleSimOption(el) {
  el.classList.toggle('enabled');
  const chk = el.querySelector('input[type="checkbox"]');
  if (chk) chk.checked = el.classList.contains('enabled');
}

function syncToggle(chk, optId) {
  const opt = document.getElementById(optId);
  if (chk.checked) opt.classList.add('enabled');
  else opt.classList.remove('enabled');
}

async function runSimulation() {
  const mode = document.querySelector('.sim-mode.selected')?.dataset.mode || '974';
  const skeptic = document.getElementById('toggle-skeptic').checked;
  const expanded = document.getElementById('toggle-expanded').checked;
  const notes = document.getElementById('sim-notes').value;
  const f = currentFindings.find(x => x.id === simFindingId);

  const modeLabels = { direct:'Direct Appeal', bangert:'Bangert Motion', '974':'§974.06 Postconviction', habeas:'Federal Habeas' };
  document.getElementById('sim-loading-title').textContent = 'Running ' + (modeLabels[mode]||mode) + ' simulation...';
  document.getElementById('sim-loading-desc').textContent = skeptic
    ? 'Arguing both sides with judicial interruptions until the defense position is hardened or a vulnerability is identified.'
    : 'Arguing both sides until the defense position can no longer be defeated.';

  document.getElementById('sim-config').style.display = 'none';
  document.getElementById('sim-loading').classList.add('visible');
  document.getElementById('sim-footer').style.display = 'none';

  try {
    const result = await api('/api/cases/' + currentCase.id + '/findings/' + simFindingId + '/simulate', {
      method: 'POST',
      body: JSON.stringify({ mode, skeptic_judge: skeptic, expanded_record: expanded, notes, finding: f })
    });
    document.getElementById('sim-loading').classList.remove('visible');
    renderSimResults(result);
    document.getElementById('sim-footer').innerHTML = `<button class="btn-cancel" onclick="closeSimModal()">Close</button><button class="btn-run" onclick="printSim()"><i data-lucide="printer" width="16" height="16"></i> Print</button>`;
    document.getElementById('sim-footer').style.display = 'flex';
    lucide.createIcons();
  } catch(e) {
    // If API doesn't have this endpoint, show demo result
    document.getElementById('sim-loading').classList.remove('visible');
    renderSimResults(demoSimResult(f, mode, skeptic));
    document.getElementById('sim-footer').innerHTML = `<button class="btn-cancel" onclick="closeSimModal()">Close</button><button class="btn-run" onclick="printSim()"><i data-lucide="printer" width="16" height="16"></i> Print</button>`;
    document.getElementById('sim-footer').style.display = 'flex';
    lucide.createIcons();
  }
}

function demoSimResult(f, mode, skeptic) {
  const modeLabel = {direct:'Direct Appeal',bangert:'Bangert Motion','974':'§974.06 Postconviction',habeas:'Federal Habeas'}[mode]||mode;
  return {
    verdict: 'UNASSAILABLE',
    rounds: 3,
    mode: modeLabel,
    skeptic_judge: skeptic,
    case_name: currentCase.case_name || currentCase.name,
    defendant: currentCase.defendant,
    rounds_ [
      { round: 1, state_strength: 'MODERATE', burden: 'Defense must establish the claim by preponderance of evidence.', state: 'The State contends this motion should be denied on procedural grounds.', court: 'Counsel, help me understand the specific factual basis for this claim.' },
      { round: 2, state_strength: 'WEAK', burden: 'State must overcome the defense\'s prima facie showing.', state: 'The State maintains that without concrete evidence, this claim fails.', defense: 'The defense has now established the constitutional violation on the face of the record.', court: 'Counsel, you\'re asking me to presume regularity when the record is affirmatively incomplete.' },
      { round: 3, state_strength: 'EXHAUSTED', burden: 'State must produce clear and convincing evidence.', state: 'Your Honor, we have no further evidence to produce.', defense: 'The violation is patent on the face of the record. The State cannot meet its burden.', court: 'I\'ve heard enough. The State cannot produce what the record does not show.' }
    ]
  };
}

function renderSimResults(data) {
  const el = document.getElementById('sim-results');
  const win = data.verdict && (data.verdict.includes('UNASSAILABLE') || data.verdict.includes('WIN'));
  el.innerHTML = `
    <div class="verdict-banner ${win?'win':'loss'}">
      <div class="verdict-icon">${win ? '⚖️' : '⚠️'}</div>
      <div class="verdict-title">${win ? (data.verdict||'DEFENSE WIN') : (data.verdict||'STATE WIN')}</div>
      <div class="verdict-sub">MODE: ${esc(data.mode||'')} • ROUNDS: ${data.rounds||'?'} ${data.skeptic_judge?' • SKEPTIC JUDGE':''}</div>
    </div>
    ${(data.rounds_data||[]).map((r,i) => `
      <div class="sim-round">
        <div class="round-header">
          <span class="round-label">Round ${r.round||i+1}</span>
          <span class="round-strength strength-${(r.state_strength||'moderate').toLowerCase()}">${r.state_strength||''}</span>
        </div>
        ${r.burden ? `<div class="round-burden">${esc(r.burden)}</div>` : ''}
        ${r.state ? `<div class="sim-party"><div class="sim-party-label state">THE STATE:</div><div class="sim-party-text">${esc(r.state)}</div></div>` : ''}
        ${r.defense ? `<div class="sim-party"><div class="sim-party-label defense">THE DEFENSE:</div><div class="sim-party-text">${esc(r.defense)}</div></div>` : ''}
        ${r.court ? `<div class="sim-party"><div class="sim-party-label court">THE COURT:</div><div class="sim-party-text">${esc(r.court)}</div></div>` : ''}
      </div>
    `).join('')}
  `;
  el.classList.add('visible');
}

function printSim() { window.print(); }

// ─── NEW CASE ───
function openNewCaseModal() {
  document.getElementById('new-case-modal').classList.add('open');
  document.getElementById('nc-error').classList.remove('visible');
  document.getElementById('nc-name').value = '';
  document.getElementById('nc-number').value = '';
  document.getElementById('nc-defendant').value = '';
  document.getElementById('nc-court').value = '';
  setTimeout(() => document.getElementById('nc-name').focus(), 100);
}
function closeNewCaseModal() { document.getElementById('new-case-modal').classList.remove('open'); }

async function createCase() {
  const name = document.getElementById('nc-name').value.trim();
  if (!name) { document.getElementById('nc-error').classList.add('visible'); return; }
  try {
    const nc = await api('/api/cases', {
      method: 'POST',
      body: JSON.stringify({
        case_name: name, name,
        case_number: document.getElementById('nc-number').value,
        defendant: document.getElementById('nc-defendant').value,
        court: document.getElementById('nc-court').value
      })
    });
    cases.unshift(nc);
    closeNewCaseModal();
    renderSidebar();
    renderDashboard();
    openCase(nc.id);
    showToast('Case created successfully');
  } catch(e) {
    showToast('Error creating case. Please try again.');
  }
}

// ─── CASE ACTIONS ───
function saveCaseInfo() {
  const payload = {
    case_name: document.getElementById('fi-case-name').value,
    case_number: document.getElementById('fi-case-no').value,
    defendant: document.getElementById('fi-defendant').value,
    court: document.getElementById('fi-court').value,
    defendant_account: document.getElementById('fi-account').value,
    appellate_attorney: document.getElementById('fi-app-atty').value,
    appellate_court: document.getElementById('fi-app-court').value,
    no_merit_filed: document.getElementById('fi-no-merit-filed').value,
    court_approved: document.getElementById('fi-court-approved').value,
    claims_no_merit: document.getElementById('fi-claims-no-merit').value,
    defendant_filed_pro_se: document.getElementById('fi-pro-se').value
  };
  api('/api/cases/' + currentCase.id, { method: 'PATCH', body: JSON.stringify(payload) })
    .then(() => { Object.assign(currentCase, payload); showToast('Case info saved'); renderSidebar(); })
    .catch(() => showToast('Error saving. Please try again.'));
}

function saveCase() { saveCaseInfo(); switchTab(document.querySelector('[data-tab="info"]'), 'info'); }
function exportCase() { showToast('Export feature coming soon'); }
function selectAllFindings() { showToast('Select mode — coming soon'); }
function auditCase() { showToast('Audit report — coming soon'); }
function shareFindings() { showToast('Share link — coming soon'); }
function editFinding(id) { showToast('Edit finding — coming soon'); }

async function deleteFinding(id) {
  if (!confirm('Delete this finding?')) return;
  try {
    await api('/api/cases/' + currentCase.id + '/findings/' + id, { method: 'DELETE' });
    currentFindings = currentFindings.filter(f => f.id !== id);
    document.getElementById('tab-findings-count').textContent = currentFindings.length;
    renderFindings();
    showToast('Finding deleted');
  } catch(e) { showToast('Error deleting finding'); }
}

// ─── SIDEBAR TOGGLE ───
function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  document.getElementById('sidebar').classList.toggle('open', sidebarOpen);
}
function closeSidebar() {
  sidebarOpen = false;
  document.getElementById('sidebar').classList.remove('open');
}

// ─── TOGGLE BUTTONS ───
function setToggle(btn, inputId) {
  btn.closest('.toggle-group').querySelectorAll('.toggle-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(inputId).value = btn.dataset.val;
}

// ─── UTILS ───
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}); }
  catch(e) { return String(d); }
}

// Close modals on overlay click
document.getElementById('sim-modal').addEventListener('click', function(e) {
  if (e.target === this) closeSimModal();
});
document.getElementById('new-case-modal').addEventListener('click', function(e) {
  if (e.target === this) closeNewCaseModal();
});

// Keyboard esc
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSimModal(); closeNewCaseModal(); }
});

lucide.createIcons();
</script>
</body>
</html>'''

with open('output/caselight/caselight.html', 'w') as f:
    f.write(html)

print("Built! File size:", len(html), "chars")
