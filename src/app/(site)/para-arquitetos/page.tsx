import { ContentPage } from "@/components/sections/ContentPage";
import { paraArquitetos } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(paraArquitetos);

export default function Page() {
  return <ContentPage page={paraArquitetos} />;
}
