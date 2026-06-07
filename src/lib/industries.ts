/* Industries / sectors Clix builds for. Grounded in the real client base
 * (see clients.ts): real-estate, finance, healthcare, retail, logistics,
 * education. Each entry is framed Matrix-style — an action verb + the
 * business outcome — but written fresh for Clix. Used by the /industries
 * page and the nav "תעשיות" dropdown. */

/** A single capability inside a sector's system: a named capability plus a
 * short paragraph explaining what it does and how it plugs into the whole. */
export type IndustrySolution = {
  /** Short capability name (2–4 words). */
  title: string;
  /** One–two sentences: what it does and the value it creates. */
  body: string;
};

export type Industry = {
  slug: string;
  /** lucide-react icon name. */
  icon:
    | "Building2"
    | "Landmark"
    | "HeartPulse"
    | "ShoppingBag"
    | "Truck"
    | "GraduationCap";
  /** abstract, on-brand cover image from /public */
  image: string;
  name: string;
  /** Short verb+benefit line shown in the nav dropdown and as the card kicker. */
  verb: string;
  /** The sector's real operational pain, in one sentence. */
  pain: string;
  /** One line framing the three capabilities below as a single connected system. */
  systemLead: string;
  /** What Clix builds for this sector — named capabilities, not bare lines. */
  solutions: IndustrySolution[];
  /** A representative, defensible outcome. */
  outcome: string;
  /** Longer intro paragraph for the sector's detail page. */
  intro: string;
  /** Related service slugs (from services.ts) to cross-link. */
  relatedServices: string[];
  /** Per-sector gradient [from, to] — gives each page its own colour identity. */
  theme: [string, string];
  /** Solutions layout variant: connected "flow" stepper or solid "cards". */
  layout: "flow" | "cards";
};

export const industries: Industry[] = [
  {
    slug: "real-estate",
    icon: "Building2",
    image: "/hero1.png",
    name: "נדל״ן",
    verb: "לסגור עסקאות מהר יותר",
    pain: "לידים נופלים בין הסדקים, והמתווך הראשון שמגיב מנצח.",
    systemLead:
      "לא כלי בודד, אלא שכבה אחת שמחברת בין הליד, הנכס והמתווך מהרגע שהפנייה נכנסת ועד שהעסקה נסגרת.",
    solutions: [
      {
        title: "סוכן לידים ב-WhatsApp",
        body: "מגיב לכל פנייה תוך שניות, מסנן לידים רציניים, עונה על שאלות נפוצות ומתאם סיורים ישירות ביומן 24/7, גם כשאף מתווך לא זמין.",
      },
      {
        title: "CRM שמרכז הכול",
        body: "כל פנייה, נכס, שיחה ומסמך במקום אחד. המתווך רואה את ההיסטוריה המלאה של הלקוח בלחיצה בלי לחפש בין מיילים, אקסלים וצ׳אטים.",
      },
      {
        title: "מעקבים שלא נשכחים",
        body: "המערכת יודעת מתי לחזור לכל ליד ושולחת תזכורת או הודעה אוטומטית בזמן הנכון כך שאף עסקה לא מתקררת בגלל שכחה אנושית.",
      },
    ],
    outcome: "מענה ראשוני בשניות לא בשעות.",
    intro:
      "בנדל״ן, מי שמגיב ראשון מנצח. בנינו מערכות שמוודאות שאף ליד לא נופל בין הסדקים מהפנייה הראשונה ועד חתימת החוזה, מסביב לשעון.",
    relatedServices: ["whatsapp", "crm", "ai-agents"],
    theme: ["#3B7BF5", "#A3E635"],
    layout: "flow",
  },
  {
    slug: "finance",
    icon: "Landmark",
    image: "/aipic.jpg",
    name: "פיננסים וביטוח",
    verb: "לתפעל בלי לוותר על ציות",
    pain: "תהליכים ידניים, רגולציה כבדה ואפס מקום לטעות בנתונים.",
    systemLead:
      "מערכת אחת שמחברת קליטה, בדיקות ודיווח לתהליך רציף מהיר כלפי הלקוח, מדויק כלפי הרגולטור.",
    solutions: [
      {
        title: "אוטומציית מסמכים ו-KYC",
        body: "המערכת אוספת מסמכים, מריצה בדיקות KYC ומתעדת כל שלב בדרך תהליך אחיד שעומד בדרישות הרגולציה, בלי עבודת כפיים שמייצרת טעויות.",
      },
      {
        title: "סוכן AI לקליטה ושירות",
        body: "קולט לקוחות חדשים ועונה על שאלות נפוצות בשפה ברורה, ומפנה לנציג אנושי בדיוק כשצריך כך שהצוות מתפנה למקרים שבאמת דורשים שיקול דעת.",
      },
      {
        title: "אינטגרציות מאובטחות",
        body: "חיבור מוצפן בין מערכות הליבה, הדיווח והבקרה כל נתון זורם פעם אחת, ממקור אחד, בלי העתקות ידניות בין מערכות.",
      },
    ],
    outcome: "תהליך קליטה שלם בלי להעתיק נתון פעמיים.",
    intro:
      "בעולם הפיננסי כל תהליך כפוף לרגולציה ולדיוק. אנחנו מאוטמים את העבודה החוזרת בלי להתפשר על ציות, אבטחה ושקיפות.",
    relatedServices: ["integrations", "ai-agents", "software"],
    theme: ["#1E4DB8", "#A3E635"],
    layout: "cards",
  },
  {
    slug: "healthcare",
    icon: "HeartPulse",
    image: "/hero2.png",
    name: "בריאות וקליניקות",
    verb: "להחזיר זמן לצוות הרפואי",
    pain: "המזכירות טובעת בתיאומים, תזכורות ומענה טלפוני חוזר.",
    systemLead:
      "שכבה אחת שמחברת יומן, מטופלים וצוות כך שכל אינטראקציה קורית במקום הנכון, בלי לעבור דרך הטלפון.",
    solutions: [
      {
        title: "תיאום תורים אוטומטי",
        body: "מטופלים קובעים, מזיזים ומבטלים תורים בעצמם, והיומן מתעדכן בזמן אמת המזכירות משוחררת מהטלפון בלי שאף תור ייפול בין הכיסאות.",
      },
      {
        title: "תזכורות חכמות",
        body: "הודעות תזכורת אוטומטיות שמורידות אי-הגעות (No-shows), וכשתור מתבטל המערכת ממלאת את החלון שהתפנה, בלי שיחה אחת ידנית.",
      },
      {
        title: "מענה ראשוני מבוסס ידע",
        body: "עונה על שאלות מטופלים נפוצות מתוך מאגר הידע של הקליניקה, בכל שעה, ומסנן מראש מה שבאמת מצריך התערבות של איש צוות.",
      },
    ],
    outcome: "פחות זמן על הטלפון, יותר זמן עם המטופל.",
    intro:
      "צוותים רפואיים מבזבזים שעות על תיאומים ומענה טלפוני חוזר. בנינו מערכות שמחזירות את הזמן הזה למטופלים בלי לפגוע בשירות.",
    relatedServices: ["whatsapp", "ai-agents", "integrations"],
    theme: ["#0EA5E9", "#BEF264"],
    layout: "flow",
  },
  {
    slug: "retail",
    icon: "ShoppingBag",
    image: "/tt.jpg",
    name: "קמעונאות ו-eCommerce",
    verb: "להמיר כל שיחה למכירה",
    pain: "עגלות ננטשות ושאלות לקוחות מחכות שעות למענה.",
    systemLead:
      "מערכת אחת שמחברת שיחה, מלאי ולקוח כך שכל פנייה הופכת להזדמנות מכירה, בכל שעה.",
    solutions: [
      {
        title: "בוט מכירות ב-WhatsApp",
        body: "ממליץ על מוצרים, עונה על שאלות ומשלים רכישה בתוך הצ׳אט חוויית קנייה מלאה בלי שהלקוח צריך לצאת מהשיחה.",
      },
      {
        title: "אוטומציית מלאי והזמנות",
        body: "מלאי, הזמנות והחזרות מסונכרנים מקצה לקצה הלקוח רואה זמינות אמיתית, והצוות מפסיק לרדוף אחרי עדכונים ידניים.",
      },
      {
        title: "מועדון לקוחות חכם",
        body: "התראות והצעות שמופעלות לפי התנהגות הקנייה עגלה נטושה, חידוש מלאי או מבצע שמחזירות לקוחות, בלי דיוור גנרי שכולם מתעלמים ממנו.",
      },
    ],
    outcome: "ערוץ מכירה שעובד גם ב-2 בלילה.",
    intro:
      "בקמעונאות, מהירות המענה היא ההבדל בין מכירה לעגלה נטושה. הפכנו את ערוצי השירות למכונת מכירה שעובדת מסביב לשעון.",
    relatedServices: ["whatsapp", "integrations", "ai-agents"],
    theme: ["#2563EB", "#A3E635"],
    layout: "cards",
  },
  {
    slug: "logistics",
    icon: "Truck",
    image: "/automations.jpg",
    name: "לוגיסטיקה ותפעול",
    verb: "לאחד מערך מקוטע",
    pain: "חמישה כלים שלא מדברים, ועדכון שמגיע תמיד מאוחר מדי.",
    systemLead:
      "שכבה אחת שמחברת הזמנות, משלוחים וצוותים לתמונת אמת אחת במקום חמישה כלים שלא מדברים.",
    solutions: [
      {
        title: "פורטל תפעול אחד",
        body: "מחליף גיליונות ומערכות ישנות במסך אחד כל הזמנה, משלוח וסטטוס במקום אחד, נגיש לכל מי שצריך אותו בזמן אמת.",
      },
      {
        title: "סוכן AI לתמחור וניתוב",
        body: "מחשב מחיר, בוחר את המסלול היעיל ביותר ומבצע הזמנות אוטומטית החלטות שלקחו דקות של בירורים קורות בשניות.",
      },
      {
        title: "סנכרון בזמן אמת",
        body: "הזמנות, משלוחים ודיווח מתעדכנים יחד ברגע שמשהו זז כך שכולם עובדים מול אותה תמונה, בלי פערי מידע בין צוותים.",
      },
    ],
    outcome: "תמונת תפעול אחת בזמן אמת.",
    intro:
      "תפעול לוגיסטי מתפזר על פני מערכות, גיליונות וצוותים. איחדנו אותם לתמונת אמת אחת שמתעדכנת בזמן אמת בלי גזור-הדבק.",
    relatedServices: ["software", "integrations", "ai-agents"],
    theme: ["#1E4DB8", "#BEF264"],
    layout: "flow",
  },
  {
    slug: "education",
    icon: "GraduationCap",
    image: "/new.png",
    name: "חינוך והדרכה",
    verb: "להפוך פניות לרשמות",
    pain: "פניות מתעניינים נערמות, והליווי האישי לא מתכלל.",
    systemLead:
      "מערכת אחת שמלווה את המתעניין לאורך כל המסע מהשאלה הראשונה, דרך ההרשמה, ועד הליווי השוטף.",
    solutions: [
      {
        title: "ליווי נרשמים מקצה לקצה",
        body: "סוכן שמלווה כל מתעניין מהשאלה הראשונה ועד ההרשמה עונה, מזכיר ומקדם את התהליך, כך שאף פנייה לא נשארת ללא מענה.",
      },
      {
        title: "אוטומציית הרשמה",
        body: "תזכורות, תשלומים ומסמכים נשלחים ונאספים אוטומטית תהליך הרשמה חלק שמוריד עומס מהמנהלה ומונע נשירה באמצע הדרך.",
      },
      {
        title: "מענה רב-לשוני 24/7",
        body: "עונה על שאלות נפוצות בכל שפה ובכל שעה כך שכל מתעניין מקבל תשובה מיד, בלי תלות בשעות הפעילות של המוסד.",
      },
    ],
    outcome: "כל פנייה מקבלת מענה מיד.",
    intro:
      "מוסדות חינוך מאבדים נרשמים בגלל ליווי לא עקבי. בנינו מערכות שמלוות כל מתעניין מהשאלה הראשונה ועד ההרשמה ברצף ובלי לאבד אף אחד.",
    relatedServices: ["ai-agents", "whatsapp", "integrations"],
    theme: ["#5C93F7", "#BEF264"],
    layout: "cards",
  },
];

export const getIndustry = (slug: string) =>
  industries.find((i) => i.slug === slug);
