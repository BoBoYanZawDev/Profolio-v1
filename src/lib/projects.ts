import { prisma } from "./prisma";
import { FALLBACK_PROJECTS } from "./fallback";
import type { Project } from "@/store/ui";

/**
 * Reads projects from MySQL; if the database is unreachable or empty,
 * falls back to demo content so the site always renders.
 */
export async function getProjectsSafe(): Promise<{
  projects: Project[];
  source: "database" | "fallback";
}> {
  try {
    const rows = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    if (rows.length > 0) {
      return { projects: rows as Project[], source: "database" };
    }
    return { projects: FALLBACK_PROJECTS, source: "fallback" };
  } catch {
    return { projects: FALLBACK_PROJECTS, source: "fallback" };
  }
}
