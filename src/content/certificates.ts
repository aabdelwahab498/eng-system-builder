import type { Locale } from "@/types/content";

import itil4 from "@/assets/certificates/itil4.png.asset.json";
import cyberSecurity from "@/assets/certificates/cyber-security.jpg.asset.json";
import alxFoundations from "@/assets/certificates/alx-professional-foundations.png.asset.json";
import agileLeadership from "@/assets/certificates/agile-leadership.png.asset.json";
import aspnetCore from "@/assets/certificates/aspnet-core-solid.png.asset.json";

export type Certificate = {
  id: string;
  title: { en: string; ar: string };
  issuer: { en: string; ar: string };
  date: { en: string; ar: string };
  detail?: { en: string; ar: string };
  verifyUrl?: string;
  image: string;
};

/** Only facts printed on the uploaded certificates — nothing inferred. */
export const certificates: Certificate[] = [
  {
    id: "itil-4",
    title: { en: "ITIL 4 Certification (Specialization, 4 courses)", ar: "شهادة ITIL 4 (تخصص من 4 دورات)" },
    issuer: { en: "EDUCBA · Coursera", ar: "EDUCBA · كورسيرا" },
    date: { en: "Oct 10, 2024", ar: "١٠ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/specialization/ZPHD9USUJBM9",
    image: itil4.url,
  },
  {
    id: "aspnet-core-solid",
    title: {
      en: "ASP.NET Core — SOLID and Clean Architecture (.NET 5 and Up)",
      ar: "ASP.NET Core — مبادئ SOLID والمعمارية النظيفة (.NET 5 وأحدث)",
    },
    issuer: { en: "Packt · Coursera", ar: "Packt · كورسيرا" },
    date: { en: "Sep 30, 2024", ar: "٣٠ سبتمبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/AWGZEWHG31JM",
    image: aspnetCore.url,
  },
  {
    id: "agile-leadership",
    title: {
      en: "ENCE607.4x: Agile Leadership Principles and Practices",
      ar: "ENCE607.4x: مبادئ وممارسات القيادة الرشيقة",
    },
    issuer: { en: "USMx · University System of Maryland · edX", ar: "USMx · جامعة ولاية ماريلاند · edX" },
    date: { en: "Issued December 12, 2024", ar: "صدرت في ١٢ ديسمبر ٢٠٢٤" },
    detail: {
      en: "Verified Certificate ID 25cf42c898ad4809afcf9481546fd750",
      ar: "معرّف الشهادة الموثقة 25cf42c898ad4809afcf9481546fd750",
    },
    image: agileLeadership.url,
  },
  {
    id: "cyber-security",
    title: { en: "Cyber Security — Certificate of Diploma", ar: "الأمن السيبراني — دبلومة" },
    issuer: { en: "American Board of Professional Studies", ar: "المجلس الأمريكي للدراسات المهنية" },
    date: { en: "Issued October 2025", ar: "صدرت في أكتوبر ٢٠٢٥" },
    detail: {
      en: "35 hours · Grade: Excellent · Serial No. 0036583",
      ar: "٣٥ ساعة · التقدير: ممتاز · رقم مسلسل ٠٠٣٦٥٨٣",
    },
    verifyUrl: "https://www.americanboard-us.com",
    image: cyberSecurity.url,
  },
  {
    id: "alx-professional-foundations",
    title: { en: "Professional Foundations — Certificate of Completion", ar: "الأسس المهنية — شهادة إتمام" },
    issuer: { en: "ALX", ar: "ALX" },
    date: { en: "Issued 17 September 2024", ar: "صدرت في ١٧ سبتمبر ٢٠٢٤" },
    detail: {
      en: "Professional Development Skills for the Digital Age",
      ar: "مهارات التطوير المهني للعصر الرقمي",
    },
    verifyUrl: "https://intranet.alxswe.com/certificates/7ChcX2mM5P",
    image: alxFoundations.url,
  },
];

export const pick = (value: { en: string; ar: string }, locale: Locale) =>
  locale === "ar" ? value.ar : value.en;
