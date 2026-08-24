/**
 * Canonical commerce model (Phase 5).
 *
 * Single typed source for service offerings, the project payment structure and
 * the manual payment methods. Components must never hardcode payment data —
 * they read it from here (through `src/content/api.ts`).
 *
 * This is a MANUAL payment model: no gateway, no automatic verification.
 */

import type { Localized } from "../schema";

export type ServiceTier = "core" | "extended";

export type ServiceOffering = {
  id: string;
  /** lucide-react icon name resolved by the UI. */
  icon: string;
  tier: ServiceTier;
  enabled: boolean;
  order: number;
  title: Localized<string>;
  description: Localized<string>;
  deliverables: Localized<string[]>;
  cta: Localized<string>;
};

export type PaymentMethodKind = "instapay" | "wallet" | "bank";

export type PaymentMethod = {
  id: string;
  currency: "EGP" | "USD";
  type: PaymentMethodKind;
  /** Wire / ACH etc. */
  rails: string[];
  enabled: boolean;
  order: number;
  name: Localized<string>;
  description: Localized<string>;
  instructions: Localized<string>;
  paymentLink?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  bankAddress?: string;
  phoneNumber?: string;
};

export type PaymentSubmissionStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_more_information";

export type PaymentSubmission = {
  id: string;
  clientName: string;
  email: string;
  whatsapp: string;
  serviceId: string;
  projectName: string;
  amount: string;
  currency: "EGP" | "USD";
  methodId: string;
  proofFilename: string;
  proofType: string;
  proofSizeBytes: number;
  submittedAt: string;
  status: PaymentSubmissionStatus;
  note?: string;
};

/** Contact channels — kept explicitly separate to avoid confusion. */
export const CONTACT_NUMBERS = {
  /** Chat / support only. */
  whatsapp: "+201105725029",
  whatsappDisplay: "+20 11 0572 5029",
  /** Vodafone Cash wallet — payments only, NOT WhatsApp. */
  vodafoneCash: "+201050064380",
  vodafoneCashDisplay: "+20 10 5006 4380",
} as const;

export const services: ServiceOffering[] = [
  {
    id: "website",
    icon: "Globe",
    tier: "core",
    enabled: true,
    order: 1,
    title: { en: "Website Development", ar: "تطوير المواقع" },
    description: {
      en: "Fast, responsive, SEO-ready marketing and business websites.",
      ar: "مواقع تعريفية وتجارية سريعة ومتجاوبة وجاهزة لمحركات البحث.",
    },
    deliverables: {
      en: ["Responsive multi-page site", "SEO metadata & sitemap", "Content structure", "Deployment"],
      ar: ["موقع متجاوب متعدد الصفحات", "بيانات SEO وخريطة الموقع", "هيكلة المحتوى", "النشر"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "web-app",
    icon: "LayoutDashboard",
    tier: "core",
    enabled: true,
    order: 2,
    title: { en: "Web Application Development", ar: "تطوير تطبيقات الويب" },
    description: {
      en: "Dashboards, portals and internal systems with real workflows.",
      ar: "لوحات تحكم وأنظمة داخلية بمسارات عمل حقيقية.",
    },
    deliverables: {
      en: ["Application UI", "Auth & roles", "Data model", "Admin screens"],
      ar: ["واجهة التطبيق", "المصادقة والصلاحيات", "نموذج البيانات", "شاشات الإدارة"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "mobile-app",
    icon: "Smartphone",
    tier: "core",
    enabled: true,
    order: 3,
    title: { en: "Mobile Application Development", ar: "تطوير تطبيقات الموبايل" },
    description: {
      en: "Cross-platform mobile apps built with Flutter.",
      ar: "تطبيقات موبايل متعددة المنصات باستخدام Flutter.",
    },
    deliverables: {
      en: ["iOS + Android build", "API integration", "Store-ready assets"],
      ar: ["إصدار iOS و Android", "ربط مع الـ API", "أصول جاهزة للمتاجر"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "backend-api",
    icon: "Server",
    tier: "core",
    enabled: true,
    order: 4,
    title: { en: "Backend & API Development", ar: "تطوير الباك اند وواجهات الـ API" },
    description: {
      en: "ASP.NET Core / FastAPI services with explicit contracts.",
      ar: "خدمات ASP.NET Core و FastAPI بعقود واضحة.",
    },
    deliverables: {
      en: ["REST API", "Database schema", "API documentation", "Deployment setup"],
      ar: ["REST API", "مخطط قاعدة البيانات", "توثيق الـ API", "إعداد النشر"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "fullstack",
    icon: "Layers",
    tier: "core",
    enabled: true,
    order: 5,
    title: { en: "Full-Stack Application Development", ar: "تطوير تطبيقات متكاملة" },
    description: {
      en: "End-to-end product build: data model, backend, interface, delivery.",
      ar: "بناء المنتج كاملًا: البيانات، الباك اند، الواجهة، والتسليم.",
    },
    deliverables: {
      en: ["Complete application", "Source code", "Environments", "Handover"],
      ar: ["تطبيق متكامل", "الكود المصدري", "البيئات", "التسليم"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "ai",
    icon: "BrainCircuit",
    tier: "core",
    enabled: true,
    order: 6,
    title: { en: "AI / LLM / AI Agent Development", ar: "حلول الذكاء الاصطناعي ووكلاء LLM" },
    description: {
      en: "LLM features and agent workflows integrated into real product flows.",
      ar: "مزايا الذكاء الاصطناعي ووكلاء المهام مدمجة داخل مسارات المنتج.",
    },
    deliverables: {
      en: ["AI-backed feature", "Prompt & output handling", "Agent workflow", "Evaluation notes"],
      ar: ["ميزة مدعومة بالذكاء الاصطناعي", "إدارة المدخلات والمخرجات", "مسار عمل الوكيل", "ملاحظات التقييم"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "automation",
    icon: "Workflow",
    tier: "core",
    enabled: true,
    order: 7,
    title: { en: "Software Automation", ar: "أتمتة البرمجيات" },
    description: {
      en: "Automating repetitive multi-step processes across systems.",
      ar: "أتمتة العمليات المتكررة متعددة الخطوات بين الأنظمة.",
    },
    deliverables: {
      en: ["Automation pipeline", "Integrations", "Monitoring hooks"],
      ar: ["مسار أتمتة", "التكاملات", "نقاط مراقبة"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "seo",
    icon: "Search",
    tier: "extended",
    enabled: true,
    order: 8,
    title: { en: "SEO Services", ar: "خدمات تحسين محركات البحث" },
    description: {
      en: "Technical SEO, structured data and content structure.",
      ar: "SEO تقني وبيانات منظمة وهيكلة محتوى.",
    },
    deliverables: {
      en: ["Technical audit", "Metadata & schema", "Content recommendations"],
      ar: ["فحص تقني", "بيانات وصفية ومخططات", "توصيات المحتوى"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "social-marketing",
    icon: "Megaphone",
    tier: "extended",
    enabled: true,
    order: 9,
    title: { en: "Social Media / Facebook Marketing", ar: "التسويق عبر السوشيال ميديا وفيسبوك" },
    description: {
      en: "Campaign planning and content delivered with the extended team.",
      ar: "تخطيط الحملات والمحتوى بالتعاون مع الفريق الموسّع.",
    },
    deliverables: {
      en: ["Campaign plan", "Content set", "Publishing schedule"],
      ar: ["خطة الحملة", "حزمة المحتوى", "جدول النشر"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "voice-video",
    icon: "Mic",
    tier: "extended",
    enabled: true,
    order: 10,
    title: { en: "AI Voice-over / Video Services", ar: "التعليق الصوتي والفيديو بالذكاء الاصطناعي" },
    description: {
      en: "AI voice-over and video editing produced with the extended team.",
      ar: "تعليق صوتي ومونتاج فيديو بالتعاون مع الفريق الموسّع.",
    },
    deliverables: {
      en: ["Script pass", "Voice-over track", "Edited video"],
      ar: ["مراجعة النص", "المسار الصوتي", "الفيديو بعد المونتاج"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
  {
    id: "cartoon",
    icon: "Clapperboard",
    tier: "extended",
    enabled: true,
    order: 11,
    title: { en: "Cartoon / AI Video Production", ar: "إنتاج الكارتون والفيديو بالذكاء الاصطناعي" },
    description: {
      en: "Character-driven animated episodes produced with the extended team.",
      ar: "حلقات كرتونية بشخصيات بالتعاون مع الفريق الموسّع.",
    },
    deliverables: {
      en: ["Story outline", "Character art", "Rendered episode"],
      ar: ["مخطط القصة", "رسوم الشخصيات", "الحلقة النهائية"],
    },
    cta: { en: "Start Project", ar: "ابدأ المشروع" },
  },
];

export const paymentSteps: { n: string; title: Localized<string>; body: Localized<string> }[] = [
  {
    n: "01",
    title: { en: "Project Agreement", ar: "الاتفاق على المشروع" },
    body: { en: "Scope, timeline and deliverables are agreed in writing.", ar: "يتم الاتفاق كتابيًا على النطاق والجدول الزمني والمخرجات." },
  },
  {
    n: "02",
    title: { en: "Deposit Payment", ar: "دفع المقدم" },
    body: { en: "The project begins after the agreed initial deposit is received.", ar: "يبدأ المشروع بعد استلام المقدم المتفق عليه." },
  },
  {
    n: "03",
    title: { en: "Development", ar: "التنفيذ" },
    body: { en: "The team develops the project according to the approved scope.", ar: "ينفذ الفريق المشروع وفق النطاق المعتمد." },
  },
  {
    n: "04",
    title: { en: "Final Approval", ar: "الاعتماد النهائي" },
    body: { en: "You review the delivery and confirm the final agreement.", ar: "تراجع التسليم وتؤكد الاعتماد النهائي." },
  },
  {
    n: "05",
    title: { en: "Final Payment", ar: "الدفعة النهائية" },
    body: { en: "The remaining balance is paid after approval.", ar: "يتم سداد المبلغ المتبقي بعد الاعتماد." },
  },
  {
    n: "06",
    title: { en: "Project Delivery", ar: "تسليم المشروع" },
    body: { en: "You receive the project in the agreed delivery format.", ar: "تستلم المشروع بالصيغة المتفق عليها." },
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: "instapay",
    currency: "EGP",
    type: "instapay",
    rails: ["InstaPay"],
    enabled: true,
    order: 1,
    name: { en: "InstaPay", ar: "إنستا باي" },
    description: { en: "Manual Bank / Wallet Transfer — Egyptian Pound.", ar: "تحويل بنكي/محفظة يدوي — بالجنيه المصري." },
    instructions: {
      en: "Open the InstaPay link, complete the transfer, then upload a screenshot showing the successful payment.",
      ar: "افتح رابط إنستا باي، أكمل التحويل، ثم ارفع صورة توضح نجاح الدفع.",
    },
    paymentLink: "https://ipn.eg/S/rssob201050064380/instapay/10rXjL",
  },
  {
    id: "vodafone-cash",
    currency: "EGP",
    type: "wallet",
    rails: ["Vodafone Cash"],
    enabled: true,
    order: 2,
    name: { en: "Vodafone Cash", ar: "فودافون كاش" },
    description: { en: "Manual Bank / Wallet Transfer — Egyptian Pound.", ar: "تحويل بنكي/محفظة يدوي — بالجنيه المصري." },
    instructions: {
      en: "Pay via Vodafone Cash to the number below and upload your payment screenshot.",
      ar: "ادفع عبر فودافون كاش على الرقم التالي وارفع صورة إثبات الدفع.",
    },
    phoneNumber: CONTACT_NUMBERS.vodafoneCashDisplay,
  },
  {
    id: "wire",
    currency: "USD",
    type: "bank",
    rails: ["Wire Transfer"],
    enabled: true,
    order: 3,
    name: { en: "USD Wire Transfer", ar: "تحويل بنكي دولي (Wire)" },
    description: { en: "Manual Bank Transfer — US Dollar.", ar: "تحويل بنكي يدوي — بالدولار الأمريكي." },
    instructions: {
      en: "Send a wire transfer using the official details below, then upload your payment confirmation.",
      ar: "أرسل التحويل باستخدام البيانات الرسمية أدناه، ثم ارفع تأكيد الدفع.",
    },
    bankName: "Lead Bank",
    bankAddress: "1801 Main St., Kansas City, MO 64108",
    accountHolder: "AHMED ABDELWAHAB",
    accountNumber: "210890831578",
    routingNumber: "101019644",
  },
  {
    id: "ach",
    currency: "USD",
    type: "bank",
    rails: ["ACH"],
    enabled: true,
    order: 4,
    name: { en: "USD ACH Bank Transfer", ar: "تحويل ACH بالدولار" },
    description: { en: "Manual Bank Transfer — US Dollar.", ar: "تحويل بنكي يدوي — بالدولار الأمريكي." },
    instructions: {
      en: "Send an ACH transfer using the official details below, then upload your payment confirmation.",
      ar: "أرسل تحويل ACH باستخدام البيانات الرسمية أدناه، ثم ارفع تأكيد الدفع.",
    },
    bankName: "Lead Bank",
    bankAddress: "1801 Main St., Kansas City, MO 64108",
    accountHolder: "AHMED ABDELWAHAB",
    accountNumber: "210890831578",
    routingNumber: "101019644",
  },
];
