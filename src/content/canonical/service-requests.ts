/**
 * Per-service project-request dialog configuration.
 *
 * Every service offering gets its own dialog identity: a localized brief,
 * realistic platform / scope options and one service-specific question, so the
 * request form reflects what the service actually is instead of a generic
 * one-size-fits-all form.
 */

import type { Localized } from "../schema";

export type ServiceRequestField = {
  /** Form key stored in the submission payload. */
  key: string;
  label: Localized<string>;
  kind: "text" | "select";
  options?: Localized<string[]>;
  placeholder?: string;
};

export type ServiceRequestConfig = {
  /** Short localized brief shown under the service title in the dialog. */
  brief: Localized<string>;
  platformOptions: Localized<string[]>;
  scopeOptions: Localized<string[]>;
  /** Service-specific questions rendered after the standard fields. */
  extraFields: ServiceRequestField[];
};

const enAr = (en: string[], ar: string[]): Localized<string[]> => ({ en, ar });

export const serviceRequestConfigs: Record<string, ServiceRequestConfig> = {
  website: {
    brief: {
      en: "A fast, responsive, SEO-ready website for your business — from structure to deployment.",
      ar: "موقع سريع ومتجاوب وجاهز لمحركات البحث لنشاطك التجاري — من الهيكلة حتى النشر.",
    },
    platformOptions: enAr(
      ["Marketing / business site", "E-commerce store", "Landing page", "Blog / content site"],
      ["موقع تعريفي / تجاري", "متجر إلكتروني", "صفحة هبوط", "مدونة / موقع محتوى"],
    ),
    scopeOptions: enAr(
      ["Single page", "Up to 5 pages", "Up to 15 pages", "Large site / store"],
      ["صفحة واحدة", "حتى 5 صفحات", "حتى 15 صفحة", "موقع / متجر كبير"],
    ),
    extraFields: [
      {
        key: "domain",
        label: { en: "Do you already have a domain and hosting?", ar: "هل لديك دومين واستضافة بالفعل؟" },
        kind: "select",
        options: enAr(
          ["Yes, both", "Domain only", "No, I need both", "Not sure"],
          ["نعم، الاثنان", "الدومين فقط", "لا، أحتاج الاثنين", "غير متأكد"],
        ),
      },
      {
        key: "references",
        label: { en: "Websites you like (links, optional)", ar: "مواقع تعجبك (روابط، اختياري)" },
        kind: "text",
        placeholder: "https://…",
      },
    ],
  },

  "web-app": {
    brief: {
      en: "A working web application: dashboards, portals or internal systems with real user workflows.",
      ar: "تطبيق ويب فعلي: لوحات تحكم أو بوابات أو أنظمة داخلية بمسارات عمل حقيقية.",
    },
    platformOptions: enAr(
      ["Admin dashboard", "Customer portal", "Internal operations system", "SaaS product"],
      ["لوحة تحكم إدارية", "بوابة عملاء", "نظام عمليات داخلي", "منتج SaaS"],
    ),
    scopeOptions: enAr(
      ["MVP (core flows only)", "Standard (auth + main modules)", "Full system (multiple roles & modules)"],
      ["نسخة أولية (المسارات الأساسية)", "قياسي (مصادقة + الوحدات الرئيسية)", "نظام كامل (أدوار ووحدات متعددة)"],
    ),
    extraFields: [
      {
        key: "users",
        label: { en: "Who will use it? (roles, approx. number of users)", ar: "من سيستخدمه؟ (الأدوار، العدد التقريبي للمستخدمين)" },
        kind: "text",
      },
      {
        key: "integrations",
        label: { en: "Systems it must connect to (optional)", ar: "أنظمة يجب أن يتكامل معها (اختياري)" },
        kind: "text",
      },
    ],
  },

  "mobile-app": {
    brief: {
      en: "A cross-platform Flutter app for iOS and Android, ready for the stores.",
      ar: "تطبيق Flutter متعدد المنصات لنظامي iOS و Android، جاهز للمتاجر.",
    },
    platformOptions: enAr(
      ["Android only", "iOS only", "iOS + Android", "App + web admin panel"],
      ["أندرويد فقط", "iOS فقط", "iOS + أندرويد", "تطبيق + لوحة تحكم ويب"],
    ),
    scopeOptions: enAr(
      ["MVP (one core feature set)", "Standard app", "Full product (payments, notifications, admin)"],
      ["نسخة أولية (مجموعة مزايا أساسية)", "تطبيق قياسي", "منتج كامل (مدفوعات، إشعارات، إدارة)"],
    ),
    extraFields: [
      {
        key: "backend",
        label: { en: "Do you already have a backend / API?", ar: "هل لديك باك اند / API بالفعل؟" },
        kind: "select",
        options: enAr(
          ["Yes, ready", "Partially", "No, build it too", "Not sure"],
          ["نعم، جاهز", "جزئيًا", "لا، ابنِه أيضًا", "غير متأكد"],
        ),
      },
      {
        key: "appIdea",
        label: { en: "Similar apps you like (optional)", ar: "تطبيقات مشابهة تعجبك (اختياري)" },
        kind: "text",
      },
    ],
  },

  "backend-api": {
    brief: {
      en: "ASP.NET Core / FastAPI services with explicit contracts, documentation and deployment setup.",
      ar: "خدمات ASP.NET Core و FastAPI بعقود واضحة وتوثيق وإعداد نشر.",
    },
    platformOptions: enAr(
      ["REST API", "API + background jobs", "Microservices", "Integration layer between systems"],
      ["REST API", "API + مهام خلفية", "مايكروسيرفيسز", "طبقة تكامل بين الأنظمة"],
    ),
    scopeOptions: enAr(
      ["Single service / module", "Full backend for one product", "Multiple services"],
      ["خدمة / وحدة واحدة", "باك اند كامل لمنتج واحد", "خدمات متعددة"],
    ),
    extraFields: [
      {
        key: "stack",
        label: { en: "Preferred stack", ar: "التقنيات المفضلة" },
        kind: "select",
        options: enAr(
          ["ASP.NET Core", "FastAPI (Python)", "Node.js", "Let Ahmed decide"],
          ["ASP.NET Core", "FastAPI (بايثون)", "Node.js", "اترك الاختيار لأحمد"],
        ),
      },
      {
        key: "database",
        label: { en: "Database (existing or preferred)", ar: "قاعدة البيانات (الحالية أو المفضلة)" },
        kind: "text",
      },
    ],
  },

  fullstack: {
    brief: {
      en: "End-to-end product build: data model, backend, interface and delivery — one accountable build.",
      ar: "بناء المنتج كاملًا: البيانات والباك اند والواجهة والتسليم — بناء واحد بمسؤولية كاملة.",
    },
    platformOptions: enAr(
      ["Web app", "Web + mobile", "Internal business system", "Marketplace / multi-sided product"],
      ["تطبيق ويب", "ويب + موبايل", "نظام أعمال داخلي", "منصة سوق متعددة الأطراف"],
    ),
    scopeOptions: enAr(
      ["MVP in weeks", "V1 product", "Full product with admin & reporting"],
      ["نسخة أولية خلال أسابيع", "منتج إصدار أول", "منتج كامل مع إدارة وتقارير"],
    ),
    extraFields: [
      {
        key: "stage",
        label: { en: "Where are you now?", ar: "أين أنت الآن؟" },
        kind: "select",
        options: enAr(
          ["Idea only", "Have designs / mockups", "Have a partial build", "Replacing an existing system"],
          ["فكرة فقط", "لديّ تصاميم", "لديّ جزء مبني", "استبدال نظام قائم"],
        ),
      },
      {
        key: "deadline",
        label: { en: "Target launch date (optional)", ar: "موعد الإطلاق المستهدف (اختياري)" },
        kind: "text",
      },
    ],
  },

  ai: {
    brief: {
      en: "LLM features and AI agents integrated into real product flows — not demos.",
      ar: "مزايا ذكاء اصطناعي ووكلاء مدمجة في مسارات منتج حقيقية — وليست عروضًا تجريبية.",
    },
    platformOptions: enAr(
      ["Chat assistant for my product", "AI agent for a business workflow", "Document / data AI (RAG)", "AI content generation"],
      ["مساعد محادثة لمنتجي", "وكيل ذكي لمسار عمل", "ذكاء للمستندات والبيانات (RAG)", "توليد محتوى بالذكاء الاصطناعي"],
    ),
    scopeOptions: enAr(
      ["One AI feature", "Full AI workflow", "AI across the product"],
      ["ميزة ذكاء واحدة", "مسار عمل ذكي كامل", "ذكاء اصطناعي عبر المنتج"],
    ),
    extraFields: [
      {
        key: "data",
        label: { en: "What data should it work on?", ar: "ما البيانات التي سيعمل عليها؟" },
        kind: "text",
      },
      {
        key: "existingProduct",
        label: { en: "Is this for an existing product?", ar: "هل هذا لمنتج قائم؟" },
        kind: "select",
        options: enAr(["Yes, integrate into it", "No, new product", "Not sure"], ["نعم، دمجه فيه", "لا، منتج جديد", "غير متأكد"]),
      },
    ],
  },

  automation: {
    brief: {
      en: "Automating repetitive multi-step processes across your systems, with monitoring built in.",
      ar: "أتمتة العمليات المتكررة متعددة الخطوات بين أنظمتك، مع مراقبة مدمجة.",
    },
    platformOptions: enAr(
      ["Data sync between systems", "Scheduled reports / notifications", "File & document processing", "Custom workflow automation"],
      ["مزامنة بيانات بين الأنظمة", "تقارير / إشعارات مجدولة", "معالجة ملفات ومستندات", "أتمتة مسار عمل مخصص"],
    ),
    scopeOptions: enAr(
      ["One process", "A few connected processes", "Department-wide automation"],
      ["عملية واحدة", "عدة عمليات مترابطة", "أتمتة على مستوى قسم كامل"],
    ),
    extraFields: [
      {
        key: "process",
        label: { en: "Describe the process you want to automate", ar: "صف العملية التي تريد أتمتتها" },
        kind: "text",
      },
      {
        key: "frequency",
        label: { en: "How often does it run?", ar: "كم مرة تتم هذه العملية؟" },
        kind: "select",
        options: enAr(["Hourly / daily", "Weekly", "Monthly", "On demand"], ["كل ساعة / يوميًا", "أسبوعيًا", "شهريًا", "عند الطلب"]),
      },
    ],
  },

  seo: {
    brief: {
      en: "Technical SEO: audit, structured data, metadata and content structure that search engines understand.",
      ar: "SEO تقني: فحص وبيانات منظمة وبيانات وصفية وهيكلة محتوى تفهمها محركات البحث.",
    },
    platformOptions: enAr(
      ["Technical audit only", "Audit + fixes implementation", "Ongoing monthly SEO"],
      ["فحص تقني فقط", "فحص + تنفيذ الإصلاحات", "SEO شهري مستمر"],
    ),
    scopeOptions: enAr(
      ["Single site", "Site + blog / content", "Multiple sites"],
      ["موقع واحد", "موقع + مدونة / محتوى", "عدة مواقع"],
    ),
    extraFields: [
      {
        key: "siteUrl",
        label: { en: "Your website URL", ar: "رابط موقعك" },
        kind: "text",
        placeholder: "https://…",
      },
      {
        key: "goal",
        label: { en: "Main SEO goal", ar: "هدف الـ SEO الرئيسي" },
        kind: "select",
        options: enAr(
          ["More organic traffic", "Better ranking for keywords", "Fix technical issues", "New site — start right"],
          ["زيادة الزيارات العضوية", "ترتيب أفضل للكلمات المفتاحية", "إصلاح مشاكل تقنية", "موقع جديد — بداية صحيحة"],
        ),
      },
    ],
  },

  "social-marketing": {
    brief: {
      en: "Campaign planning, content sets and publishing schedules — executed with the extended team.",
      ar: "تخطيط حملات وحزم محتوى وجداول نشر — بالتعاون مع الفريق الموسّع.",
    },
    platformOptions: enAr(
      ["Facebook / Instagram", "TikTok", "Multi-platform", "X / LinkedIn"],
      ["فيسبوك / إنستجرام", "تيك توك", "منصات متعددة", "إكس / لينكد إن"],
    ),
    scopeOptions: enAr(
      ["One campaign", "Monthly content plan", "Full account management"],
      ["حملة واحدة", "خطة محتوى شهرية", "إدارة حساب كاملة"],
    ),
    extraFields: [
      {
        key: "business",
        label: { en: "Your business / product and target audience", ar: "نشاطك / منتجك والجمهور المستهدف" },
        kind: "text",
      },
      {
        key: "budget",
        label: { en: "Monthly ads budget (optional)", ar: "ميزانية الإعلانات الشهرية (اختياري)" },
        kind: "text",
      },
    ],
  },

  "voice-video": {
    brief: {
      en: "AI voice-over and video editing: script pass, voice track and a finished edited video.",
      ar: "تعليق صوتي ومونتاج بالذكاء الاصطناعي: مراجعة النص والمسار الصوتي وفيديو نهائي.",
    },
    platformOptions: enAr(
      ["Voice-over only", "Video editing only", "Voice-over + full video"],
      ["تعليق صوتي فقط", "مونتاج فيديو فقط", "تعليق صوتي + فيديو كامل"],
    ),
    scopeOptions: enAr(
      ["Short (under 1 min)", "1–5 minutes", "Series / multiple videos"],
      ["قصير (أقل من دقيقة)", "من 1 إلى 5 دقائق", "سلسلة / عدة فيديوهات"],
    ),
    extraFields: [
      {
        key: "language",
        label: { en: "Voice-over language & style", ar: "لغة وأسلوب التعليق الصوتي" },
        kind: "select",
        options: enAr(
          ["Arabic (Egyptian)", "Arabic (formal)", "English", "Multiple languages"],
          ["عربي (مصري)", "عربي فصحى", "إنجليزي", "عدة لغات"],
        ),
      },
      {
        key: "script",
        label: { en: "Do you have a script ready?", ar: "هل لديك نص جاهز؟" },
        kind: "select",
        options: enAr(["Yes", "No, write it for me", "Draft — needs polish"], ["نعم", "لا، اكتبه لي", "مسودة — تحتاج صقلًا"]),
      },
    ],
  },

  cartoon: {
    brief: {
      en: "Character-driven animated episodes: story outline, character art and the rendered episode.",
      ar: "حلقات كرتونية بشخصيات: مخطط القصة ورسوم الشخصيات والحلقة النهائية.",
    },
    platformOptions: enAr(
      ["Single episode", "Short series (3–5 episodes)", "Ongoing series"],
      ["حلقة واحدة", "سلسلة قصيرة (3–5 حلقات)", "سلسلة مستمرة"],
    ),
    scopeOptions: enAr(
      ["Under 1 minute", "1–3 minutes per episode", "Longer episodes"],
      ["أقل من دقيقة", "من 1 إلى 3 دقائق للحلقة", "حلقات أطول"],
    ),
    extraFields: [
      {
        key: "characters",
        label: { en: "Characters & story idea", ar: "الشخصيات وفكرة القصة" },
        kind: "text",
      },
      {
        key: "style",
        label: { en: "Preferred art style", ar: "أسلوب الرسم المفضل" },
        kind: "select",
        options: enAr(
          ["2D cartoon", "3D style", "Anime-inspired", "Let the team suggest"],
          ["كرتون ثنائي الأبعاد", "ثلاثي الأبعاد", "بأسلوب الأنمي", "اقتراح الفريق"],
        ),
      },
    ],
  },
};

/** Fallback config for services without a dedicated one. */
export const defaultServiceRequestConfig: ServiceRequestConfig = {
  brief: { en: "Tell us about your project.", ar: "احكِ لنا عن مشروعك." },
  platformOptions: enAr(
    ["Web", "Mobile", "Web + Mobile", "Backend / API", "AI system", "Not sure yet"],
    ["ويب", "موبايل", "ويب + موبايل", "باك اند / API", "نظام ذكاء اصطناعي", "غير محدد بعد"],
  ),
  scopeOptions: enAr(["Small", "Medium", "Large", "Not sure yet"], ["صغير", "متوسط", "كبير", "غير محدد بعد"]),
  extraFields: [],
};
