import type { LucideIcon } from "lucide-react";
import {
  MessageCircle,
  Webhook,
  Clock,
  Bot,
  Sparkles,
  Database,
  Mail,
  Users,
  Send,
  GitBranch,
  Globe,
  FileText,
} from "lucide-react";

export type NodeKind =
  | "wa-trigger"
  | "webhook"
  | "schedule"
  | "agent"
  | "classifier"
  | "crm"
  | "wa-send"
  | "email"
  | "slack"
  | "db"
  | "http"
  | "branch";

export type NodeCategory = "Trigger" | "AI" | "Action" | "Data";

export type NodeSpec = {
  kind: NodeKind;
  category: NodeCategory;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
};

export const NODE_SPECS: Record<NodeKind, NodeSpec> = {
  "wa-trigger": {
    kind: "wa-trigger",
    category: "Trigger",
    label: "WhatsApp נכנס",
    subtitle: "הודעה נכנסת",
    icon: MessageCircle,
    accent: "#25D366",
  },
  webhook: {
    kind: "webhook",
    category: "Trigger",
    label: "Webhook",
    subtitle: "טריגר HTTP",
    icon: Webhook,
    accent: "#7C3AED",
  },
  schedule: {
    kind: "schedule",
    category: "Trigger",
    label: "תזמון",
    subtitle: "CRON או אינטרוול",
    icon: Clock,
    accent: "#0EA5E9",
  },
  agent: {
    kind: "agent",
    category: "AI",
    label: "סוכן AI",
    subtitle: "GPT / Claude · כלים",
    icon: Bot,
    accent: "#FF4A1C",
  },
  classifier: {
    kind: "classifier",
    category: "AI",
    label: "מסווג",
    subtitle: "כוונה / סנטימנט",
    icon: Sparkles,
    accent: "#F59E0B",
  },
  crm: {
    kind: "crm",
    category: "Action",
    label: "CRM",
    subtitle: "יצירת / עדכון רשומה",
    icon: Users,
    accent: "#0E0E0E",
  },
  "wa-send": {
    kind: "wa-send",
    category: "Action",
    label: "שליחת WhatsApp",
    subtitle: "תגובה / שידור",
    icon: Send,
    accent: "#25D366",
  },
  email: {
    kind: "email",
    category: "Action",
    label: "אימייל",
    subtitle: "שליחה טרנזקציונית",
    icon: Mail,
    accent: "#E11D48",
  },
  slack: {
    kind: "slack",
    category: "Action",
    label: "Slack",
    subtitle: "התראה לערוץ",
    icon: FileText,
    accent: "#4A154B",
  },
  db: {
    kind: "db",
    category: "Data",
    label: "בסיס נתונים",
    subtitle: "שאילתה / כתיבה",
    icon: Database,
    accent: "#1F3C2B",
  },
  http: {
    kind: "http",
    category: "Data",
    label: "HTTP",
    subtitle: "API חיצוני",
    icon: Globe,
    accent: "#334155",
  },
  branch: {
    kind: "branch",
    category: "Data",
    label: "התפצלות",
    subtitle: "תנאי if / else",
    icon: GitBranch,
    accent: "#9333EA",
  },
};

export const NODE_LIST: NodeSpec[] = Object.values(NODE_SPECS);

export type FlowNode = {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
};

export type FlowEdge = {
  id: string;
  from: string;
  to: string;
};

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 86;
export const PORT_Y_OFFSET = 43; // center port vertically
