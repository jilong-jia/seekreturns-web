import type { MetadataRoute } from "next";
import { generateRootPagesSitemap } from "@/app/lib/sitemap/generateRootPagesSitemap";
import { generateUtilityPagesSitemap } from "@/app/lib/sitemap/generateUtilityPagesSitemap";
import { generateSectionPagesSitemap } from "@/app/lib/sitemap/generateSectionPagesSitemap";
import { generateInformationalPagesSitemap } from "@/app/lib/sitemap/generateInformationalPagesSitemap";
import { stockComparisonList } from "@/data/stock-comparison-list";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const URLS_PER_SITEMAP = 30_000;
const LANGUAGES = ["en", "zh"] as const;

export async function generateSitemaps(): Promise<{ id: string }[]> {
  const totalUrls = stockComparisonList.length * LANGUAGES.length;
  const chunkCount = Math.ceil(totalUrls / URLS_PER_SITEMAP);

  const routes = [{ id: "general" }];

  for (let i = 1; i <= chunkCount; i++) {
    routes.push({ id: `stock-comparisons-${i}` });
  }

  return routes;
}

async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  
  const id = await props.id;
  
  if (id === "general") {
    const root = generateRootPagesSitemap();
    const utility = generateUtilityPagesSitemap();
    const section = generateSectionPagesSitemap();
    const info = await generateInformationalPagesSitemap();
    return [...root, ...utility, ...section, ...info];
  }

  if (id.startsWith("stock-comparisons-")) {
    const chunkId = parseInt(id.split("-").pop() || "1", 10);

    const slugsPerChunk = Math.floor(URLS_PER_SITEMAP / LANGUAGES.length);
    const start = (chunkId - 1) * slugsPerChunk;
    const slice = stockComparisonList.slice(start, start + slugsPerChunk);

    return slice.flatMap(({ slug }) =>
      LANGUAGES.map((lang) => {
        const path = `/${lang}/stock-comparisons/${slug}`;
        return {
          url: `${BASE_URL}${path}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 1.0,
          images: [`${BASE_URL}${path}/featured-image`],
        };
      }),
    );
  }

  return [];
}

export default sitemap;
