export type Project = {
  slug: string;
  client: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "northwind-sales-agent",
    client: "Northwind Logistics",
    title: "סוכן מכירות AI שמטפל בהזמנות משלוחים 24/7",
    category: "סוכני AI · WhatsApp",
    year: "2025",
    summary:
      "החלפנו מערך מענה נכנס של 6 נציגים בסוכן AI ב-WhatsApp שמכשיר לידים, מתמחר נתיבים ומבצע הזמנות מטענים. הנציגים האנושיים נכנסים רק במקרי קצה.",
    metrics: [
      { label: "לידים איכותיים נכנסים", value: "+312%" },
      { label: "זמן מענה ממוצע", value: "11 שנ׳" },
      { label: "הזמנות שטופלו אוטומטית", value: "68%" },
    ],
    tags: ["סוכני AI", "WhatsApp", "אינטגרציות"],
    accent: "#3D4A59",
  },
  {
    slug: "loomly-ops-portal",
    client: "Loomly Manufacturing",
    title: "פורטל תפעולי ייעודי לרצפת ייצור עם 200 עובדים",
    category: "תוכנה מותאמת אישית",
    year: "2024",
    summary:
      "פורטל תפעולי בזמן אמת שמחבר בין נתוני מכונות, משמרות ובקרת איכות. שישה כלים מיושנים הוחלפו באפליקציה אחת שהצוות באמת עובד איתה.",
    metrics: [
      { label: "כלים שאוחדו", value: "6 → 1" },
      { label: "זיהוי השבתות", value: "בזמן אמת" },
      { label: "זמן קליטת עובד חדש", value: "−74%" },
    ],
    tags: ["תוכנה מותאמת אישית", "דשבורדים"],
    accent: "#5C7488",
  },
  {
    slug: "kindred-support-copilot",
    client: "Kindred Care",
    title: "Copilot מבוסס AI שהכפיל את קיבולת צוות התמיכה",
    category: "סוכני AI",
    year: "2025",
    summary:
      "Copilot פרטי לתמיכה שאומן על חמש שנות פניות, מסמכים פנימיים והנחיות קליניות. מנסח תשובות, מציף תקדימים, ומזהה מקרים שדורשים הסלמה.",
    metrics: [
      { label: "פניות לנציג ביום", value: "2.1×" },
      { label: "איכות מענה ראשוני", value: "+39%" },
      { label: "כיסוי מאגר הידע", value: "94%" },
    ],
    tags: ["סוכני AI", "ייעוץ"],
    accent: "#6E8398",
  },
  {
    slug: "atlas-finance-flows",
    client: "Atlas Finance Group",
    title: "200+ אוטומציות שמאחדות מערך מקוטע",
    category: "אינטגרציות",
    year: "2024",
    summary:
      "שנה של התאמות ידניות והעתקה-הדבקה בין הנהלת חשבונות, CRM ומערכות דיווח הוחלפה ב-n8n וב-middleware מותאם אישית.",
    metrics: [
      { label: "תהליכים שיושמו", value: "210" },
      { label: "רישומים ידניים בחודש", value: "−96%" },
      { label: "מחזור סגירה", value: "11 ימים → 3 ימים" },
    ],
    tags: ["אינטגרציות", "ייעוץ"],
    accent: "#2A3540",
  },
];
