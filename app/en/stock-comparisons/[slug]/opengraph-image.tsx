import { generateFeaturedImage } from "@/app/lib/en/content/generateFeaturedImage";
import { generatePageInfo } from "./lib/generatePageInfo";

import { stockComparisonList } from "@/data/stock-comparison-list";
import { tableOfContents } from "./data/tableOfContents";

type GenerateImageMetadataParams = { params: Promise<{ slug: string }> };
type OpenGraphImageParams = { params: Promise<{ slug: string }>; id: string };

export async function generateImageMetadata({
  params,
}: GenerateImageMetadataParams) {
  const slug = (await params).slug;

  const matchingComparison = stockComparisonList.find(
    (comparison) => comparison.slug === slug,
  );

  if (!matchingComparison) {
    return []; // ✅ 必须返回空数组
  }

  const { title } = generatePageInfo(matchingComparison);

  return [
    {
      id: "normal",
      alt: `${title} - Seek Returns`,
      size: { width: 1200, height: 630 },
      contentType: "image/png",
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function OpenGraphImage({ params, id }: OpenGraphImageParams) {
  const slug = (await params).slug;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const matchingComparison = stockComparisonList.find(
    (comparison) => comparison.slug === slug,
  );

  if (!matchingComparison) {
    return new Response("Image Not Found", { status: 404 });
  }

  const { title, description, modifiedDate } =
    generatePageInfo(matchingComparison);

  const section = "Stock Comparison";

  const breadcrumbList = [
    {
      name: "Stock Comparisons",
      url: `${baseUrl}/en/stock-comparisons`,
    },
    {
      name: title,
      url: `${baseUrl}/en/stock-comparisons/${slug}`,
    },
  ];

  const openGraphImage = generateFeaturedImage({
    title,
    description,
    modifiedDate,
    tableOfContents,
    section,
    breadcrumbList,
  });

  return openGraphImage;
}

export default OpenGraphImage;
