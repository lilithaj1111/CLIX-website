import { Cpu, Rocket, Shield, Star, type LucideIcon } from "lucide-react";

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio?: string;
  /** Explicit path to the member's photo (relative to /public). When set,
   *  `hasPhoto` is implied true. Falls back to gradient initials avatar
   *  if the image fails to load. */
  photo?: string;
  /** CSS `object-position` for the photo crop. Use to keep the subject's
   *  face inside the circular avatar mask when the source image isn't
   *  centered (e.g. full-body portraits where the head sits high). */
  focal?: string;
  /** Legacy flag — set true when an image exists at `/team/{slug}.jpg`.
   *  Prefer `photo` for explicit asset paths. */
  hasPhoto?: boolean;
};

export const FOUNDER: TeamMember = {
  slug: "founder",
  name: "Elmaliach Ido",
  role: "מייסד ומנכ״ל",
  bio: "מייסד ומנכ״ל Clix. למעלה מעשור של פיתוח סוכני AI, אוטומציות עסקיות ומערכות תוכנה ייעודיות לארגונים מובילים. מלווה כל פרויקט מהאפיון הראשוני ועד להטמעה המלאה מתוך אמונה שטכנולוגיה טובה היא זו שעובדת מהיום הראשון.",
  photo: "/team-images/founder.jpeg",
  focal: "50% 30%",
};

export const CO_FOUNDER: TeamMember = {
  slug: "shahar-apote",
  name: "Shahar Apote",
  role: "מייסד שותף",
  bio: "מייסד שותף וראש צוות הפיתוח ב-Clix. אחראי על ארכיטקטורת המערכות והטמעת הסוכנים בפועל אצל הלקוחות. כל שורת קוד שמגיעה לפרודקשן עוברת דרכו כי תשתית טובה מתחילה במישהו שלא מוותר על איכות.",
  // Photo path uses team-yarin.jpeg: the source asset filenames don't
  // match the displayed names — the file labelled "yarin" is actually
  // Shahar (the man in the cream polo), and vice versa.
  photo: "/team-images/team-yarin.jpeg",
  focal: "50% 28%",
};

export const TEAM: TeamMember[] = [
  {
    slug: "yarin-yitzhak",
    name: "Yarin Yitzhak",
    role: "ארכיטקט מערכות",
    photo: "/team-images/team-shahar.jpeg",
    focal: "50% 30%",
  },
  {
    slug: "luzon-spring",
    name: "Luzon Spring",
    role: "מהנדס תוכנה",
    photo: "/team-images/team-maayan.jpeg",
    // Full upper-body portrait — face sits in the top third
    focal: "50% 20%",
  },
  {
    slug: "giving",
    name: "giving",
    role: "מהנדס תוכנה",
    photo: "/team-images/team-matan.jpeg",
    // Close-up selfie — face nearly fills the frame, slight up
    focal: "50% 40%",
  },
  {
    slug: "ron-ben-harush",
    name: "Ron Ben Harush",
    role: "אסטרטג שיווקי",
    photo: "/team-images/team-new.jpeg",
    // Source is now a 900x900 head-and-shoulders crop (was a 900x1600
    // full-body portrait). Face sits in the top third → focal at 25%
    // centres it inside the circular avatar mask.
    focal: "50% 25%",
  },
  {
    slug: "lotan-sabag",
    name: "Lotan Sabag",
    role: "ראש תפעול",
    photo: "/team-images/team-lotan.jpeg",
    focal: "50% 35%",
  },
];

export type TeamStat = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const TEAM_STATS: TeamStat[] = [
  { icon: Star, value: "100+", label: "לקוחות מרוצים" },
  { icon: Rocket, value: "10+", label: "שנות ניסיון" },
  { icon: Cpu, value: "500+", label: "אוטומציות שנמסרו" },
  { icon: Shield, value: "עילית", label: "בוגרי יחידה 8200" },
];

