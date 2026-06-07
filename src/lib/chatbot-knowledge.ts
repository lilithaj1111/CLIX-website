/* Knowledge base for the Clix assistant chatbot. Each intent has a list of
   trigger regexes; the first matching intent wins. Replace `matchIntent`
   with a fetch to your own /api/chat route when you're ready to wire a real
   LLM in — the rest of the widget will work unchanged. */

export const WHATSAPP_NUMBER = "972559483457";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_URL = "/contact";

export type Suggestion =
  | string
  | { kind: "action"; label: string; action: "whatsapp" | "contact" };

export type Intent = {
  id: string;
  triggers: RegExp[];
  response: string;
  suggestions: Suggestion[];
};

const ACTION_WHATSAPP: Suggestion = {
  kind: "action",
  label: "מעבר ל-WhatsApp",
  action: "whatsapp",
};
const ACTION_CONTACT: Suggestion = {
  kind: "action",
  label: "פתיחת טופס יצירת קשר",
  action: "contact",
};

export const GREETING: Intent = {
  id: "greeting",
  triggers: [/^(hi|hey|hello|yo|sup|hola|good (morning|afternoon|evening)|שלום|היי|הלו|בוקר טוב|ערב טוב)\b/i],
  response:
    "היי 👋 אני העוזר של Clix. אתם מוזמנים לשאול על השירותים שלנו, על תהליך העבודה או על מחירים או לדבר ישירות עם נציג ב-WhatsApp.",
  suggestions: ["אילו שירותים אתם מציעים?", "איך אתם עובדים?", "מחירים?"],
};

export const INTENTS: Intent[] = [
  {
    id: "services-overview",
    triggers: [
      /^(what )?(services?|what do you do|what does clix do|what you offer|capabilities)/i,
      /\b(services|what you build|what you make)\b/i,
      /(שירותים|מה אתם עושים|מה אתם מציעים|יכולות)/,
    ],
    response:
      "אנחנו עוסקים בשישה תחומים:\n\n• סוכני AI חברי צוות אוטונומיים למכירות, תמיכה, מחקר ותפעול.\n• אוטומציות WhatsApp עוזרים שמזמינים, מוכרים ועוקבים.\n• הטמעת CRM HubSpot, Salesforce, Pipedrive, Attio.\n• אינטגרציות n8n, Make ו-middleware מותאם אישית.\n• תוכנה מותאמת אישית אפליקציות, דשבורדים וכלים פנימיים.\n• אסטרטגיית AI סקירות, מפות דרכים והחלטות בנייה מול רכישה.",
    suggestions: ["ספרו לי על סוכני AI", "אוטומציות WhatsApp", "מחירים?"],
  },
  {
    id: "ai-agents",
    triggers: [
      /\bai agents?\b/i,
      /\b(chatbot|chat bot|sales agent|support agent|autonomous|gpt|llm)\b/i,
      /(סוכני? AI|בוט|צ׳אטבוט|סוכן מכירות|סוכן תמיכה)/,
    ],
    response:
      "סוכני AI הם חברי צוות שאף פעם לא נחים. אנחנו מתכננים, מאמנים ומטמיעים אותם עבור מכירות, תמיכה, מחקר ותפעול בשפת המותג שלכם, על הנתונים שלכם, ובהתאם להליכי העבודה שלכם.\n\nהתוצאה: מענה ראשוני 24/7, איכות אחידה, וירידה של 30–70% בעבודה החוזרת.",
    suggestions: ["אינטגרציה עם WhatsApp?", "כמה זמן זה לוקח?", "מחירים?"],
  },
  {
    id: "whatsapp-service",
    triggers: [
      /\b(whatsapp|whatsap|wa[\s-]+(bot|assistant|agent))\b/i,
      /(וואטסאפ|ווצאפ)/,
    ],
    response:
      "WhatsApp הוא המקום שבו הלקוחות שלכם כבר נמצאים. אנחנו בונים עוזרים שמזמינים, מוכרים, תומכים ומבצעים מעקב מחוברים ל-CRM, למערכת התשלומים, ליומן ולקטלוג.\n\nהתוצאות שלקוחותינו רואים: זמני מענה מהירים פי 3–5, והמרות גבוהות מאלה של אימייל או צ׳אט באתר.",
    suggestions: ["הראו לי דוגמה", "אינטגרציה עם CRM?", "מחירים?"],
  },
  {
    id: "crm",
    triggers: [
      /\b(crm|hubspot|salesforce|pipedrive|zoho|attio|gohighlevel)\b/i,
      /(מערכת CRM|ניהול לקוחות)/,
    ],
    response:
      "אנחנו מטמיעים, מתאימים ומעבירים נתונים למערכות CRM מודרניות HubSpot, Salesforce, Zoho, Pipedrive, Attio ו-GoHighLevel בחיבור לכלים שהצוות שלכם באמת משתמש בהם. די לגיליונות שמתחזים למערכות.",
    suggestions: ["מעקבי AI?", "ליווי בהעברה?", "מחירים?"],
  },
  {
    id: "integrations",
    triggers: [
      /\b(integration|automat(ion|e)|n8n|zapier|make\.com|workflow|connect.+(tools|stack))\b/i,
      /(אינטגרציה|אוטומציה|תהליכי עבודה|חיבור מערכות)/,
    ],
    response:
      "אנחנו מחברים את כל המערך הארגוני שלכם תשלומים, הנהלת חשבונות, שיווק ותמיכה באמצעות n8n, Make וקוד מותאם אישית. כל אותה ״עבודה משעממת״ שמצטברת לשעות חוזרות מדי שבוע.",
    suggestions: ["באילו כלים אתם תומכים?", "קוד מותאם אישית?", "מחירים?"],
  },
  {
    id: "custom-software",
    triggers: [
      /\b(custom (software|app|tool|product)|bespoke|web app|internal tool|dashboard|saas)\b/i,
      /(תוכנה מותאמת|אפליקציה מותאמת|דשבורד|כלי פנימי)/,
    ],
    response:
      "כשפתרון מדף פשוט לא מספיק. אנחנו בונים יישומי Web מותאמים, כלים פנימיים, דשבורדים ומוצרי AI-Native מקצה לקצה. Next.js, React ו-TypeScript בצד הלקוח; Postgres, Node ו-Python בצד השרת. הקוד שייך לכם.",
    suggestions: ["ראו פרויקטים לדוגמה", "כמה זמן זה לוקח?", "מחירים?"],
  },
  {
    id: "consulting",
    triggers: [
      /\b(consult|strategy|audit|roadmap|where (do|should) (we|i) start|advisor)\b/i,
      /(ייעוץ|אסטרטגיה|ביקור|מפת דרכים|איפה להתחיל)/,
    ],
    response:
      "לא כל בעיה דורשת AI. אלה שכן דורשות את ה-AI הנכון. אנחנו סוקרים את התפעול שלכם, מתעדפים לפי ROI ומגדירים מה לבנות, מה לרכוש ועל מה לוותר תוכנית מתוקצבת ל-6–12 חודשים קדימה, לא מצגת בת 200 שקפים.",
    suggestions: ["אילו שירותים אתם מציעים?", "קביעת שיחה"],
  },
  {
    id: "pricing",
    triggers: [
      /\b(pric|cost|how much|budget|quote|fees|rates)/i,
      /(מחיר|עלות|תקציב|כמה זה עולה|הצעת מחיר)/,
    ],
    response:
      "המחיר תלוי בהיקף. סקירות אסטרטגיה מתחילות בחמש ספרות נמוכות-בינוניות; פרויקטי בנייה של סוכנים ואינטגרציות מסתכמים בדרך כלל בחמש ספרות בינוניות עד שש ספרות נמוכות. הדרך הטובה ביותר להתקדם: שיחה של 30 דקות, ללא מצגות נגיד לכם בכנות אם אנחנו הצוות הנכון בשבילכם.",
    suggestions: ["קביעת שיחה", "ספרו לי על השירותים שלכם"],
  },
  {
    id: "process",
    triggers: [
      /\b(process|how do you work|how does it work|methodology|timeline|how long|delivery)/i,
      /(תהליך|איך אתם עובדים|מתודולוגיה|לוח זמנים)/,
    ],
    response:
      "ארבעה שלבים:\n\n01 אבחון פגישה עם הצוות שלכם ואיתור נקודות המינוף.\n02 תכנון המערכת הקומפקטית ביותר שפותרת את הבעיה הגדולה ביותר.\n03 בנייה מהנדסים בכירים, ותוצרים שעובדים מדי שבוע.\n04 הפעלה ניטור, שיפור מתמשך והכשרת הצוות שלכם לתפעל את המערכת באופן עצמאי.",
    suggestions: ["מחירים?", "קביעת שיחה", "אילו שירותים?"],
  },
  {
    id: "contact-call",
    triggers: [
      /\b(schedule|book|set up|talk to (you|a human|someone)|call|meet|appointment)\b/i,
      /(לקבוע|לתאם|לדבר עם אדם|שיחה|פגישה)/,
    ],
    response:
      "הדרך הקלה ביותר: שלחו הודעה ב-WhatsApp אנחנו עונים תוך יום עסקים אחד (בדרך כלל הרבה יותר מהר). אפשר גם למלא את טופס יצירת הקשר או לכתוב לנו לכתובת info@clixsolution.com.",
    suggestions: [ACTION_WHATSAPP, ACTION_CONTACT],
  },
  {
    id: "team",
    triggers: [
      /\b(team|who are you|who you are|about (you|clix)|founders?|company|where are you|location)/i,
      /(צוות|מי אתם|על Clix|אודות|מייסדים|חברה|איפה אתם)/,
    ],
    response:
      "צוות בכיר של מהנדסים, מעצבים ואסטרטגים. עבודה מרחוק, פעילות גלובלית. מספקים מערכות AI לסטארטאפים, חברות בצמיחה ולמפעילים שרוב היועצים נמנעים מלעבוד איתם בשקט. עוד פרטים בעמוד /about.",
    suggestions: ["אילו שירותים אתם מציעים?", "מחירים?", "קביעת שיחה"],
  },
  {
    id: "contact-info",
    triggers: [
      /\b(email|contact|reach you|phone|number|address)/i,
      /(אימייל|מייל|יצירת קשר|טלפון|כתובת)/,
    ],
    response:
      "📧 info@clixsolution.com\n💬 WhatsApp: +972 55-948-3457\n🕐 א׳–ה׳ · 09:00–18:00",
    suggestions: [ACTION_WHATSAPP, ACTION_CONTACT],
  },
  {
    id: "example-work",
    triggers: [
      /\b(example|case study|portfolio|past work|previous|projects?|show me)/i,
      /(דוגמה|תיק עבודות|פרויקטים|עבודות קודמות|הראו לי)/,
    ],
    response:
      "התבניות שאנחנו מספקים בתדירות הגבוהה ביותר:\n\n• סוכני WhatsApp AI שמכשירים לידים, מתמחרים ומבצעים הזמנות מקצה לקצה.\n• מערכות CRM למרפאות ולעסקי שירות, שמאחדות גיליונות ומבצעות מעקבים אוטומטיים.\n• פורטלי תפעול בזמן אמת שמחליפים חמישה או שישה כלים מיושנים.\n• Copilot תמיכה שאומן על הפניות, המסמכים ונוהלי העבודה הפנימיים שלכם.\n• מארג אוטומציות שמחבר בין CRM, הנהלת חשבונות ומערכות דיווח.\n\nסקירת עבודות מלאה בעמוד /work. רוב הלקוחות שלנו תחת הסכמי סודיות נשמח לשתף מקרי בוחן ספציפיים בשיחה.",
    suggestions: ["מחירים?", "קביעת שיחה"],
  },
  {
    id: "thanks",
    triggers: [
      /^(thanks|thank you|thx|ty|cheers|appreciate)/i,
      /^(תודה|תודה רבה|המון תודה)/,
    ],
    response: "בשמחה 🙏 פנו אלינו ב-WhatsApp ברגע שתהיו מוכנים.",
    suggestions: [ACTION_WHATSAPP],
  },
];

/* ─── Context detection — picks up business hints in free text ─────────── */

const CONTEXTS = [
  { match: /\b(real estate|property|listings?|brokerage|realtor)\b/i, services: "צוותי נדל״ן", relevant: ["CRM", "סוכני AI"] },
  { match: /\b(clinic|medical|patient|dental|aesthetic|healthcare|practice)\b/i, services: "מרפאות", relevant: ["CRM", "אוטומציות WhatsApp"] },
  { match: /\b(logistics|shipping|freight|trucking|fleet|3pl)\b/i, services: "תפעול לוגיסטי", relevant: ["סוכני AI", "אינטגרציות"] },
  { match: /\b(ecommerce|e-commerce|shopify|d2c|store|retail)\b/i, services: "מסחר אלקטרוני", relevant: ["WhatsApp", "תוכנה מותאמת"] },
  { match: /\b(finance|accounting|fintech|invoice|bookkeep)\b/i, services: "צוותי פיננסים", relevant: ["אינטגרציות", "תוכנה מותאמת"] },
  { match: /\b(agency|marketing|content|saas)\b/i, services: "סוכנויות", relevant: ["תוכנה מותאמת", "אינטגרציות"] },
];

function contextHit(query: string): string | null {
  for (const c of CONTEXTS) {
    if (c.match.test(query)) {
      return `נשמע כמו תחום ${c.services} בדרך כלל אנחנו מתחילים שם עם ${c.relevant.join(" + ")}.`;
    }
  }
  return null;
}

export const FALLBACK: Intent = {
  id: "fallback",
  triggers: [],
  response:
    "לא בטוח שהבנתי במדויק. נסו לשאול אותי על השירותים שלנו, על תהליך העבודה או על מחירים או לדבר עם נציג ב-WhatsApp.",
  suggestions: [
    "אילו שירותים אתם מציעים?",
    "מחירים?",
    ACTION_WHATSAPP,
  ],
};

/* ─── Matching ───────────────────────────────────────────────────────────── */

export function matchIntent(query: string): {
  intent: Intent;
  contextNote: string | null;
} {
  const text = query.trim();
  if (!text) return { intent: FALLBACK, contextNote: null };

  for (const intent of INTENTS) {
    if (intent.triggers.some((t) => t.test(text))) {
      return { intent, contextNote: contextHit(text) };
    }
  }
  if (GREETING.triggers.some((t) => t.test(text))) {
    return { intent: GREETING, contextNote: null };
  }
  return { intent: FALLBACK, contextNote: contextHit(text) };
}
