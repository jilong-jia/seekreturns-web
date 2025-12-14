import { generateFeaturedImage } from "@/app/lib/zh/content/generateFeaturedImage";
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
    return new Response("图片未找到", { status: 404 });
  }

  const { title, description, modifiedDate } =
    generatePageInfo(matchingComparison);

  const section = "个股对比";

  const breadcrumbList = [
    {
      name: "个股对比",
      url: `${baseUrl}/zh/stock-comparisons`,
    },
    {
      name: title,
      url: `${baseUrl}/zh/stock-comparisons/${slug}`,
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
