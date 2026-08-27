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
  siMicrosoftoutlook,
} from "simple-icons";
import { cn } from "@/lib/utils";

/** LinkedIn was removed from simple-icons (brand policy) — use a known path. */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

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
  outlook: siMicrosoftoutlook.path,
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
  medium: "#ffffff",
  other: "currentColor",
};
