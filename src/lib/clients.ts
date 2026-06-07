/* The 25 client logos featured in the homepage ClientShowcase, split into
   three rows of unequal length. Files live in /public/clients/ — referenced
   here by stable slug so renaming the image doesn't ripple through copy. */

export type Client = {
  slug: string;
  name: string;
  src: string;
  industry?: string;
  since?: string;
  blurb?: string;
  tagline?: string;
};

const make = (
  slug: string,
  name: string,
  ext: "png" | "jpg" = "jpg",
  extra: Pick<Client, "industry" | "since" | "blurb" | "tagline"> = {},
): Client => ({
  slug,
  name,
  src: `/clients/client-${slug}.${ext}`,
  ...extra,
});

export const clientRows: readonly [Client[], Client[], Client[]] = [
  [
    make("coral", "Coral Tattoo Studio", "png", {
      industry: "סטודיו קעקועים",
      since: "2024",
      blurb: "מערכת הזמנות ותזכורות לתורים שנקבעים חודש מראש.",
    }),
    make("mafteach", "מפתח נכסים", "png", {
      industry: "נדל״ן",
      since: "2023",
      blurb: "ניתוב לידים דו-לשוני בין נכסים זמינים ופניות אקראיות.",
    }),
    make("dagi", "Dagi", "png", {
      industry: "נדל״ן",
      since: "2024",
      blurb: "קליטת לידים ואוטומציות WhatsApp בשני סניפים.",
    }),
    make("theranote", "Theranote", "png", {
      industry: "בריאות",
      since: "2023",
      blurb: "סיכומי טיפול שמופקים אוטומטית מהקלטות קוליות עוד לפני הפגישה הבאה.",
    }),
    make("tzmicha", "Tzmicha", "png", {
      industry: "חינוך",
      since: "2024",
      blurb: "קליטת מחזורים ועדכוני התקדמות לאורך ארבע תוכניות לימוד.",
    }),
    make("puzzle", "Puzzle", "png", {
      industry: "מיתוג",
      since: "2024",
      blurb: "קליטת לקוחות ותהליך Moodboard שמייתר את ההתכתבויות הארוכות באימייל.",
    }),
    make("bcr", "BCR", "jpg", {
      industry: "פיננסים",
      since: "2022",
      blurb: "משפך KYC ותיוג אנליסטים לתיבת מענה אחת לכל אזור.",
    }),
    make("mylo", "Mylo", "png", {
      industry: "טיפול בחיות מחמד",
      since: "2025",
      blurb: "בדיקות שגרה ותזכורות טיפוח שרצות מאליהן, בלי מעורבות הצוות.",
    }),
    make("gtx", "GTX", "jpg", {
      industry: "ביצועים",
      since: "2024",
      blurb: "לוגיסטיקת ימי מרוץ ושיגור צוותים מתואם על פני שלושה אזורי זמן.",
    }),
  ],
  [
    make("admaker", "AdMaker", "png", {
      industry: "סוכנות קריאייטיב",
      since: "2023",
      blurb: "קליטת תדריכים והעברת חומרים בין צוותי אסטרטגיה, עיצוב ומדיה.",
    }),
    make("video", "Video Studio", "png", {
      industry: "מדיה",
      since: "2024",
      blurb: "ניהול תור פרויקטים והעברת חומרי גלם שמחליפים ארבעה גיליונות Excel.",
    }),
    make("logistics", "Logistics", "jpg", {
      industry: "לוגיסטיקה",
      since: "2022",
      blurb: "שיגור נהגים ועדכוני סטטוס למוסרים, ממספר WhatsApp יחיד.",
    }),
    make("18x", "18X", "png", {
      industry: "קמעונאות",
      since: "2025",
      blurb: "תגובות אוטומטיות במועדון הלקוחות והתראות מלאי מבוססות אירועי POS.",
    }),
    make("diamond", "Diamond", "png", {
      industry: "תכשיטים",
      since: "2023",
      blurb: "מעקב הזמנות מותאמות אישית מהסקיצה ועד המסירה ללקוח.",
    }),
    make("trade30", "Trade30", "jpg", {
      industry: "פיננסים",
      since: "2023",
      blurb: "ניתוב לידים לסוחרי פרופ עם בדיקות תאימות רגולטורית לפי מדינה.",
    }),
    make("neuro", "Neuro", "jpg", {
      industry: "בריאות",
      since: "2024",
      blurb: "אישורי תורים וסקרי שביעות רצון לקבוצת מרפאות.",
    }),
    make("hava", "Hava", "jpg", {
      industry: "אורח חיים בריא",
      since: "2024",
      blurb: "חידושי מנויים ותזכורות לשיעורים שהורידו את הנטישה בשליש.",
    }),
  ],
  [
    make("ponpon", "Ponpon", "jpg", {
      industry: "יופי",
      since: "2024",
      blurb: "תהליך הזמנה וקביעת תור עצמאית על פני חמישה סניפים.",
    }),
    make("likehome", "LikeHome", "jpg", {
      industry: "נדל״ן",
      since: "2023",
      blurb: "התאמת קונים ותיאום פגישות לדירות שקשה למכור.",
    }),
    make("vaknin", "Vaknin", "jpg", {
      industry: "נדל״ן",
      since: "2022",
      blurb: "תקשורת מול שוכרים וניהול חידושי חוזים מקצה לקצה.",
    }),
    make("lioneyes", "Lion Eyes", "jpg", {
      industry: "משקפיים",
      since: "2025",
      blurb: "הזמנות מדידות מסגרות ותזכורות מרשם בערוץ אחד.",
    }),
    make("lotem", "Lotem", "jpg", {
      industry: "אירוח",
      since: "2024",
      blurb: "אישורי הזמנות ופניות קונסיירז׳ לאירוח בוטיק.",
    }),
    make("even", "Even", "jpg", {
      industry: "בנייה",
      since: "2023",
      blurb: "עדכוני אתר ותיאום קבלני משנה מחוץ לתיבת האימייל הסואנת.",
    }),
    make("tree", "Tree", "jpg", {
      industry: "קיימות",
      since: "2024",
      blurb: "קליטת חברים חדשים ודיווחי השפעה בקצב יציב.",
    }),
    make("fish", "Flying Fish Farm", "jpg", {
      industry: "חקלאות",
      since: "2023",
      blurb: "קליטת הזמנות מקונים ותיאום משלוחים ללקוחות בעולם המסעדנות.",
    }),
  ],
] as const;

export const allClients: Client[] = clientRows.flat();
