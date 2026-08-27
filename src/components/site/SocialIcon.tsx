import type { CSSProperties } from "react";
import {
  siGithub,
  siFacebook,
  siInstagram,
  siWhatsapp,
  siSnapchat,
  siX,
  siYoutube,
  siGmail,
  siMessenger,
} from "simple-icons";
import { cn } from "@/lib/utils";

/** LinkedIn was removed from simple-icons (brand policy) — use a known path. */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

/** Microsoft Outlook was removed from simple-icons (brand policy) — use a known path. */
const OUTLOOK_PATH =
  "M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z";

const PATHS: Partial<Record<SocialPlatform, string>> = {
  github: siGithub.path,
  linkedin: LINKEDIN_PATH,
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  whatsapp: siWhatsapp.path,
  snapchat: siSnapchat.path,
  x: siX.path,
  youtube: siYoutube.path,
  gmail: siGmail.path,
  outlook: OUTLOOK_PATH,
  messenger: siMessenger.path,
};

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "snapchat"
  | "x"
  | "youtube"
  | "gmail"
  | "outlook"
  | "messenger"
  | "medium"
  | "other";

export function SocialIcon({
  platform,
  className,
  style,
}: {
  platform: SocialPlatform;
  className?: string;
  style?: CSSProperties;
}) {
  const path = PATHS[platform];
  const classes = cn("size-4 shrink-0", className);

  if (!path) return null;

  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={classes}
      style={style}
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}

export const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  snapchat: "Snapchat",
  x: "X",
  youtube: "YouTube",
  gmail: "Gmail",
  outlook: "Outlook",
  messenger: "Messenger",
  medium: "Medium",
  other: "Link",
};

/** Official brand colors. Used when icons are shown side-by-side
 *  in their recognizable hues instead of a monochrome pill. */
export const SOCIAL_BRAND_COLOR: Record<SocialPlatform, string> = {
  github: "#ffffff",
  linkedin: "#0A66C2",
  facebook: "#1877F2",
  instagram: "#E1306C",
  whatsapp: "#25D366",
  snapchat: "#FFFC00",
  x: "#ffffff",
  youtube: "#FF0000",
  gmail: "#EA4335",
  outlook: "#0078D4",
  messenger: "#00B2FF",
  medium: "#ffffff",
  other: "currentColor",
};
