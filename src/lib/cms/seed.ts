/**
 * Import bridge: turns the canonical TypeScript content into CMS rows.
 *
 * This is the one-time migration path from files to the database. It reuses the
 * canonical modules directly, so no content is re-authored or duplicated.
 */

import {
  canonicalProfile,
  education,
  experience,
  products,
  projects,
  services,
  skillGroups,
} from "@/content/canonical";
import type { ContentKind, JsonObject, WorkflowState } from "./types";
import { slugify } from "./slug";

type SeedItem = {
  kind: ContentKind;
  slug: string;
  state: WorkflowState;
  visibility: { public: boolean; portfolio: boolean; cv: boolean; linkedin: boolean };
  featured: boolean;
  sortOrder: number;
  data: JsonObject;
};

type Visible = { public: boolean; portfolio: boolean; cv: boolean; linkedin: boolean };

const vis = (v?: Partial<Visible>): Visible => ({
  public: v?.public ?? false,
  portfolio: v?.portfolio ?? false,
  cv: v?.cv ?? false,
  linkedin: v?.linkedin ?? false,
});

const stateFor = (status: string | undefined, visible: Visible): WorkflowState =>
  status === "verified" && visible.public ? "published" : "draft";

export function buildSeedItems(): SeedItem[] {
  const items: SeedItem[] = [];

  items.push({
    kind: "profile",
    slug: "primary",
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: false,
    sortOrder: 0,
    data: canonicalProfile as unknown as JsonObject,
  });

  experience.forEach((item, index) => {
    const v = vis(item.visibility);
    items.push({
      kind: "experience",
      slug: slugify(item.id),
      state: stateFor(item.status, v),
      visibility: v,
      featured: false,
      sortOrder: index,
      data: item as unknown as JsonObject,
    });
  });

  education.forEach((item, index) => {
    const v = vis(item.visibility);
    items.push({
      kind: "education",
      slug: slugify(item.id),
      state: stateFor(item.status, v),
      visibility: v,
      featured: false,
      sortOrder: index,
      data: item as unknown as JsonObject,
    });
  });

  skillGroups.forEach((group, index) => {
    items.push({
      kind: "skill_group",
      slug: slugify(group.id),
      state: "published",
      visibility: { public: true, portfolio: true, cv: true, linkedin: true },
      featured: false,
      sortOrder: index,
      data: group as unknown as JsonObject,
    });
  });

  projects.forEach((project, index) => {
    const v = vis(project.visibility);
    items.push({
      kind: "project",
      slug: project.slug,
      state: stateFor(project.status, v),
      visibility: v,
      featured: Boolean(project.featured),
      sortOrder: index,
      data: project as unknown as JsonObject,
    });
  });

  products.forEach((product, index) => {
    const v = vis(product.visibility);
    items.push({
      kind: "product",
      slug: product.slug,
      state: stateFor(product.status, v),
      visibility: v,
      featured: false,
      sortOrder: index,
      data: product as unknown as JsonObject,
    });
  });

  services.forEach((service, index) => {
    const v = vis(service.visibility);
    items.push({
      kind: "service",
      slug: slugify(service.id),
      state: stateFor(service.status, v),
      visibility: v,
      featured: false,
      sortOrder: index,
      data: service as unknown as JsonObject,
    });
  });

  return items;
}
