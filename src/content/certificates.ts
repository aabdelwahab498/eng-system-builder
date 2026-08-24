import type { Locale } from "@/types/content";

import itcCertifiedTrainer from "@/assets/certificates/itc-certified-trainer-specialization.jpg";
import itil4 from "@/assets/certificates/itil4.png.asset.json";
import cyberSecurity from "@/assets/certificates/cyber-security.jpg.asset.json";
import alxFoundations from "@/assets/certificates/alx-professional-foundations.png.asset.json";
import agileLeadership from "@/assets/certificates/agile-leadership.png.asset.json";
import aspnetCore from "@/assets/certificates/aspnet-core-solid.png.asset.json";
import miniMba from "@/assets/certificates/mini-mba.jpg.asset.json";
import digitalTransformation from "@/assets/certificates/digital-transformation-security.jpg.asset.json";
import trainingOfTrainers from "@/assets/certificates/training-of-trainers.jpg.asset.json";
import dm03SocialMedia from "@/assets/certificates/dm03-social-media.png.asset.json";
import verizonSkillForward from "@/assets/certificates/verizon-skill-forward.png.asset.json";
import itilV4Svs from "@/assets/certificates/itil-v4-svs.png.asset.json";
import managerialAccounting from "@/assets/certificates/managerial-accounting.png.asset.json";
import aiDiploma from "@/assets/certificates/ai-diploma.jpg.asset.json";
import ecCouncilCyber from "@/assets/certificates/ec-council-cyber-specialization.jpg.asset.json";
import networkDefense from "@/assets/certificates/network-defense-essentials.jpg.asset.json";
import digitalForensics from "@/assets/certificates/digital-forensics-essentials.jpg.asset.json";
import netDevOps from "@/assets/certificates/netdevops.jpg.asset.json";
import operationsManagement from "@/assets/certificates/operations-management.jpg.asset.json";
import sqlIntroDavidson from "@/assets/certificates/sql-intro-davidson.png.asset.json";
import sqlConceptsIbm from "@/assets/certificates/sql-concepts-ibm.png.asset.json";
import supplyChain from "@/assets/certificates/supply-chain-management.png.asset.json";
import devopsPrerequisite from "@/assets/certificates/devops-prerequisite.png.asset.json";
import kubernetesBasics from "@/assets/certificates/kubernetes-basics-devops.png.asset.json";
import agileScrumIbm from "@/assets/certificates/agile-scrum-ibm.png.asset.json";
import csmPracticeExam from "@/assets/certificates/csm-practice-exam.png.asset.json";
import introDevopsIbm from "@/assets/certificates/intro-devops-ibm.png.asset.json";
import itFundamentals from "@/assets/certificates/it-fundamentals-ibm.png.asset.json";
import introSoftwareEngineering from "@/assets/certificates/intro-software-engineering-ibm.png.asset.json";
import introRisk from "@/assets/certificates/intro-risk-management.png.asset.json";
import marketRisk from "@/assets/certificates/market-risk-management.png.asset.json";
import operationalRisk from "@/assets/certificates/operational-risk-management.png.asset.json";
import riskSpecialization from "@/assets/certificates/risk-management-specialization.png.asset.json";

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
    id: "risk-management-specialization",
    title: {
      en: "Risk Management (Specialization, 4 courses)",
      ar: "إدارة المخاطر (تخصص من ٤ دورات)",
    },
    issuer: { en: "New York Institute of Finance · Coursera", ar: "معهد نيويورك للتمويل · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    detail: {
      en: "Introduction to Risk Management · Credit Risk Management: Frameworks and Strategies · Market Risk Management: Frameworks & Strategies · Operational Risk Management: Frameworks & Strategies",
      ar: "مقدمة في إدارة المخاطر · إدارة مخاطر الائتمان · إدارة مخاطر السوق · إدارة المخاطر التشغيلية",
    },
    verifyUrl: "https://coursera.org/verify/specialization/TGJVZV3M7FWN",
    image: riskSpecialization.url,
  },
  {
    id: "intro-risk-management",
    title: { en: "Introduction to Risk Management", ar: "مقدمة في إدارة المخاطر" },
    issuer: { en: "New York Institute of Finance · Coursera", ar: "معهد نيويورك للتمويل · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/AHH2C8S5QYA1",
    image: introRisk.url,
  },
  {
    id: "market-risk-management",
    title: {
      en: "Market Risk Management: Frameworks & Strategies",
      ar: "إدارة مخاطر السوق: الأطر والاستراتيجيات",
    },
    issuer: { en: "New York Institute of Finance · Coursera", ar: "معهد نيويورك للتمويل · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/XVYTKRIFTNLS",
    image: marketRisk.url,
  },
  {
    id: "operational-risk-management",
    title: {
      en: "Operational Risk Management: Frameworks & Strategies",
      ar: "إدارة المخاطر التشغيلية: الأطر والاستراتيجيات",
    },
    issuer: { en: "New York Institute of Finance · Coursera", ar: "معهد نيويورك للتمويل · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/8SNP4ILBK8HS",
    image: operationalRisk.url,
  },
  {
    id: "intro-software-engineering-ibm",
    title: { en: "Introduction to Software Engineering", ar: "مقدمة في هندسة البرمجيات" },
    issuer: { en: "IBM · Coursera", ar: "IBM · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/ZWFDZ4XYGWOU",
    image: introSoftwareEngineering.url,
  },
  {
    id: "it-fundamentals-ibm",
    title: {
      en: "Information Technology (IT) Fundamentals for Everyone",
      ar: "أساسيات تكنولوجيا المعلومات (IT) للجميع",
    },
    issuer: { en: "IBM · Coursera", ar: "IBM · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/VS1EZ01Y5KL8",
    image: itFundamentals.url,
  },
  {
    id: "sql-intro-davidson",
    title: {
      en: "DavidsonX_D007: Introduction to SQL",
      ar: "DavidsonX_D007: مقدمة في SQL",
    },
    issuer: { en: "DavidsonX · Davidson College · edX", ar: "DavidsonX · كلية ديفيدسون · edX" },
    date: { en: "Issued December 20, 2024", ar: "صدرت في ٢٠ ديسمبر ٢٠٢٤" },
    detail: {
      en: "Verified Certificate ID 184baaafe234dcebf721cce89146344",
      ar: "معرّف الشهادة الموثقة 184baaafe234dcebf721cce89146344",
    },
    image: sqlIntroDavidson.url,
  },
  {
    id: "sql-concepts-ibm",
    title: {
      en: "DB0303EN: SQL Concepts for Data Engineers",
      ar: "DB0303EN: مفاهيم SQL لمهندسي البيانات",
    },
    issuer: { en: "IBM · edX", ar: "IBM · edX" },
    date: { en: "Issued December 17, 2024", ar: "صدرت في ١٧ ديسمبر ٢٠٢٤" },
    detail: {
      en: "Verified Certificate ID caf1f3bd97ea4178bf421ed318671b39",
      ar: "معرّف الشهادة الموثقة caf1f3bd97ea4178bf421ed318671b39",
    },
    image: sqlConceptsIbm.url,
  },
  {
    id: "supply-chain-management",
    title: {
      en: "Supply Chain Management | إدارة سلاسل الإمداد",
      ar: "إدارة سلاسل الإمداد | Supply Chain Management",
    },
    issuer: { en: "Alfaisal University | KLD · Coursera", ar: "جامعة الفيصل | KLD · كورسيرا" },
    date: { en: "Oct 26, 2024", ar: "٢٦ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/IQOSLWIDQQJB",
    image: supplyChain.url,
  },
  {
    id: "devops-prerequisite",
    title: { en: "DevOps Prerequisite Course", ar: "دورة متطلبات DevOps" },
    issuer: { en: "KodeKloud · Coursera", ar: "KodeKloud · كورسيرا" },
    date: { en: "Oct 18, 2024", ar: "١٨ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/SHZKWEPGBLDR",
    image: devopsPrerequisite.url,
  },
  {
    id: "kubernetes-basics-devops",
    title: { en: "Kubernetes Basics for DevOps", ar: "أساسيات Kubernetes لـ DevOps" },
    issuer: { en: "KodeKloud · Coursera", ar: "KodeKloud · كورسيرا" },
    date: { en: "Oct 19, 2024", ar: "١٩ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/YK9VZUNHLR0S",
    image: kubernetesBasics.url,
  },
  {
    id: "agile-scrum-ibm",
    title: {
      en: "Introduction to Agile Development and Scrum",
      ar: "مقدمة في التطوير الرشيق و Scrum",
    },
    issuer: { en: "IBM · Coursera", ar: "IBM · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/0N8LVF5KOUCQ",
    image: agileScrumIbm.url,
  },
  {
    id: "csm-practice-exam",
    title: {
      en: "Practice Exam for Certified Scrum Master (CSM) Certification",
      ar: "اختبار تدريبي لشهادة Certified Scrum Master (CSM)",
    },
    issuer: { en: "SkillUp EdTech · Coursera", ar: "SkillUp EdTech · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/O7BJKBNCC0WH",
    image: csmPracticeExam.url,
  },
  {
    id: "intro-devops-ibm",
    title: { en: "Introduction to DevOps", ar: "مقدمة في DevOps" },
    issuer: { en: "IBM · Coursera", ar: "IBM · كورسيرا" },
    date: { en: "Oct 17, 2024", ar: "١٧ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/92ES0LAVX9SM",
    image: introDevopsIbm.url,
  },

  {
    id: "ai-diploma",
    title: {
      en: "Artificial Intelligence (AI) — Certificate of Diploma",
      ar: "الذكاء الاصطناعي (AI) — دبلومة",
    },
    issuer: { en: "American Board of Professional Studies", ar: "المجلس الأمريكي للدراسات المهنية" },
    date: { en: "Issued September 2025", ar: "صدرت في سبتمبر ٢٠٢٥" },
    detail: {
      en: "15 hours · Grade: Excellent · Serial No. 0035328",
      ar: "١٥ ساعة · التقدير: ممتاز · رقم مسلسل ٠٠٣٥٣٢٨",
    },
    verifyUrl: "https://www.americanboard-us.com",
    image: aiDiploma.url,
  },
  {
    id: "ec-council-cyber-specialization",
    title: {
      en: "Cybersecurity Attack and Defense Fundamentals (Specialization, 3 courses)",
      ar: "أساسيات الهجوم والدفاع في الأمن السيبراني (تخصص من ٣ دورات)",
    },
    issuer: { en: "EC-Council · Coursera", ar: "EC-Council · كورسيرا" },
    date: { en: "Oct 3, 2024", ar: "٣ أكتوبر ٢٠٢٤" },
    detail: {
      en: "Ethical Hacking Essentials (EHE) · Network Defense Essentials (NDE) · Digital Forensics Essentials (DFE)",
      ar: "أساسيات الاختراق الأخلاقي (EHE) · أساسيات الدفاع الشبكي (NDE) · أساسيات الأدلة الجنائية الرقمية (DFE)",
    },
    verifyUrl: "https://coursera.org/verify/specialization/QLG4FS7CSUIF",
    image: ecCouncilCyber.url,
  },
  {
    id: "network-defense-essentials",
    title: { en: "Network Defense Essentials (NDE)", ar: "أساسيات الدفاع الشبكي (NDE)" },
    issuer: { en: "EC-Council · Coursera", ar: "EC-Council · كورسيرا" },
    date: { en: "Oct 3, 2024", ar: "٣ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/9LCGLWZXCUF8",
    image: networkDefense.url,
  },
  {
    id: "digital-forensics-essentials",
    title: { en: "Digital Forensics Essentials (DFE)", ar: "أساسيات الأدلة الجنائية الرقمية (DFE)" },
    issuer: { en: "EC-Council · Coursera", ar: "EC-Council · كورسيرا" },
    date: { en: "Oct 3, 2024", ar: "٣ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/MUTXB6GCKDEZ",
    image: digitalForensics.url,
  },
  {
    id: "netdevops",
    title: {
      en: "DevOps for Network Automation (NetDevOps)",
      ar: "DevOps لأتمتة الشبكات (NetDevOps)",
    },
    issuer: { en: "Cisco Learning and Certifications · Coursera", ar: "Cisco Learning and Certifications · كورسيرا" },
    date: { en: "Sep 28, 2024", ar: "٢٨ سبتمبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/8BNKUWJACI3B",
    image: netDevOps.url,
  },
  {
    id: "mini-mba",
    title: {
      en: "Mini MBA (Mini Master of Business Administration) — Certificate of Diploma",
      ar: "ميني ماجستير إدارة الأعمال (Mini MBA) — دبلومة",
    },
    issuer: { en: "American Board of Professional Studies", ar: "المجلس الأمريكي للدراسات المهنية" },
    date: { en: "Issued March 2026", ar: "صدرت في مارس ٢٠٢٦" },
    detail: {
      en: "60 hours · Grade: Excellent · Serial No. 0039955",
      ar: "٦٠ ساعة · التقدير: ممتاز · رقم مسلسل ٠٠٣٩٩٥٥",
    },
    verifyUrl: "https://www.americanboard-us.com",
    image: miniMba.url,
  },
  {
    id: "training-of-trainers",
    title: {
      en: "International Training of Trainers Diploma (TOT)",
      ar: "دبلومة إعداد المدربين الدولية (TOT)",
    },
    issuer: { en: "International Training College (I.T.C), UK", ar: "الكلية الدولية للتدريب (I.T.C) — المملكة المتحدة" },
    date: { en: "18-03-2026 to 18-06-2026", ar: "من ١٨-٠٣-٢٠٢٦ إلى ١٨-٠٦-٢٠٢٦" },
    detail: {
      en: "Field: International Training of Trainers Diploma · Grade: Excellent · Centre: BTC for Human Resources Development · Serial No. 1306260224",
      ar: "التخصص: دبلومة إعداد المدربين الدولية · التقدير: ممتاز · المركز: BTC لتنمية الموارد البشرية · رقم مسلسل ١٣٠٦٢٦٠٢٢٤",
    },
    verifyUrl: "https://www.itc-edu.uk",
    image: trainingOfTrainers.url,
  },
  {
    id: "itc-certified-trainer-specialization",
    title: {
      en: "Certified Trainer — IT, Information Security, E-marketing & Logistics Science",
      ar: "مدرب معتمد — تكنولوجيا المعلومات وأمن المعلومات والتسويق الإلكتروني وعلوم اللوجستيات",
    },
    issuer: { en: "International Training College (I.T.C), UK", ar: "الكلية الدولية للتدريب (I.T.C) — المملكة المتحدة" },
    date: { en: "18-03-2026 to 18-06-2026", ar: "من ١٨-٠٣-٢٠٢٦ إلى ١٨-٠٦-٢٠٢٦" },
    detail: {
      en: "Certified Trainer in Information Technology, Information Security, E-marketing and Logistics Science · Grade: Excellent · Centre: BTC for Human Resources Development · Serial No. 1306260224",
      ar: "مدرب معتمد في تكنولوجيا المعلومات وأمن المعلومات والتسويق الإلكتروني وعلوم اللوجستيات · التقدير: ممتاز · المركز: BTC لتنمية الموارد البشرية · رقم مسلسل ١٣٠٦٢٦٠٢٢٤",
    },
    verifyUrl: "https://www.itc-edu.uk",
    image: itcCertifiedTrainer,
  },
  {
    id: "digital-transformation-security",
    title: {
      en: "Digital Transformation and Information Security Program",
      ar: "برنامج التحول الرقمي وأمن المعلومات",
    },
    issuer: {
      en: "American University for Science, Technology and Entrepreneurship",
      ar: "الجامعة الأمريكية للعلوم والتكنولوجيا وريادة الأعمال",
    },
    date: { en: "August 17, 2025", ar: "١٧ أغسطس ٢٠٢٥" },
    detail: { en: "Serial number GD2026585", ar: "رقم مسلسل GD2026585" },
    verifyUrl: "https://www.auste.org",
    image: digitalTransformation.url,
  },
  {
    id: "dm03-social-media",
    title: {
      en: "DM03: Online Advertising & Social Media",
      ar: "DM03: الإعلان عبر الإنترنت ووسائل التواصل الاجتماعي",
    },
    issuer: { en: "USMx · University System of Maryland · edX", ar: "USMx · جامعة ولاية ماريلاند · edX" },
    date: { en: "Issued December 26, 2024", ar: "صدرت في ٢٦ ديسمبر ٢٠٢٤" },
    detail: {
      en: "Verified Certificate ID 41f86c2123a747b4810637f9eda355d3",
      ar: "معرّف الشهادة الموثقة 41f86c2123a747b4810637f9eda355d3",
    },
    image: dm03SocialMedia.url,
  },
  {
    id: "verizon-skill-forward",
    title: {
      en: "VSFO01: Verizon Skill Forward Orientation Course",
      ar: "VSFO01: دورة التوجيه في برنامج Verizon Skill Forward",
    },
    issuer: { en: "edX", ar: "edX" },
    date: { en: "Issued December 11, 2024", ar: "صدرت في ١١ ديسمبر ٢٠٢٤" },
    detail: {
      en: "Verified Certificate ID 5d2b219bed07410da44efadcf5058bfe",
      ar: "معرّف الشهادة الموثقة 5d2b219bed07410da44efadcf5058bfe",
    },
    image: verizonSkillForward.url,
  },
  {
    id: "itil-v4-svs",
    title: {
      en: "Explanation of ITIL V4 Service Value System & its Components",
      ar: "شرح نظام القيمة الخدمية ITIL V4 ومكوناته",
    },
    issuer: { en: "EDUCBA · Coursera", ar: "EDUCBA · كورسيرا" },
    date: { en: "Oct 10, 2024", ar: "١٠ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/DRE61DKV7QJC",
    image: itilV4Svs.url,
  },
  {
    id: "managerial-accounting",
    title: {
      en: "Managerial Accounting: Cost Behaviors, Systems, and Analysis",
      ar: "المحاسبة الإدارية: سلوك التكاليف والأنظمة والتحليل",
    },
    issuer: { en: "University of Illinois Urbana-Champaign · Coursera", ar: "جامعة إلينوي أوربانا-شامبين · كورسيرا" },
    date: { en: "Oct 13, 2024", ar: "١٣ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/9XR8IWHOM8AU",
    image: managerialAccounting.url,
  },
  {
    id: "operations-management",
    title: {
      en: "Operations Management: Quality and Supply Chain",
      ar: "إدارة العمليات: الجودة وسلسلة التوريد",
    },
    issuer: { en: "University of Illinois Urbana-Champaign · Coursera", ar: "جامعة إلينوي أوربانا-شامبين · كورسيرا" },
    date: { en: "Oct 13, 2024", ar: "١٣ أكتوبر ٢٠٢٤" },
    verifyUrl: "https://coursera.org/verify/JMYV14SWP3JI",
    image: operationsManagement.url,
  },
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
