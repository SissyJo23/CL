import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useListCases, useDeleteCase } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FolderOpen,
  CheckCircle2,
  Scale,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { detectStateName, parseJurisdictionBadge } from "@/lib/jurisdictionBadge";

type FilterState =
  | "All"
  | "Wisconsin"
  | "Illinois"
  | "Indiana"
  | "Minnesota"
  | "Iowa"
  | "Michigan"
  | "Ohio"
  | "Other";

// ── Kebab menu ──────────────────────────────────────────────────────────────
function CaseCardMenu({
  caseId,
  onDelete,
}: {
  caseId: string;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative" onClick={(e) => e.preventDefault()}>
      <button
        aria-label="Case actions"
