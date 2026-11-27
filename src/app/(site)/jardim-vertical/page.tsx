import { ContentPage } from "@/components/sections/ContentPage";
import { jardimVertical } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(jardimVertical);

export default function Page() {
  return <ContentPage page={jardimVertical} />;
}
