import { useParams, Link } from "wouter";
import { useGetCase, getGetCaseQueryKey, useListDocuments, getListDocumentsQueryKey, useCreateDocument, useDeleteDocument, useListCourtSessions, getListCourtSessionsQueryKey, useGenerateCaseStrateg[...] 
import { useGetCaseStrategy, getGetCaseStrategyQueryKey } from "@workspace/api-client-react";
import type { CreateDocumentBodyDocumentType } from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Upload, Plus, Download, Scale, AlertCircle, Loader2, CheckCircle2, Swords, Map as MapIcon, RefreshCw, Play, Zap, Trash2, Gavel, Clock, GitBranch, Milestone, User, User[...] 
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserMode, type UserMode } from "@/contexts/UserModeContext";
import { MODE_LABELS } from "@/lib/modeContent";
import { parseJurisdictionBadge } from "@/lib/jurisdictionBadge";

const MODE_ICONS: Record<UserMode, React.ReactNode> = {
  inmate: <User className="w-3 h-3" />,
  advocate: <Users className="w-3 h-3" />,
  attorney: <Scale className="w-3 h-3" />,
  appellate: <BookOpen className="w-3 h-3" />,
};

... (rest of file unchanged) ...

// after existing generateStrategy declaration
const { data: existingStrategy, isLoading: strategyLoading } = useGetCaseStrategy(caseId, {
  query: { enabled: !!caseId, queryKey: getGetCaseStrategyQueryKey(caseId) },
});

const strategy = existingStrategy ?? generateStrategy.data;
