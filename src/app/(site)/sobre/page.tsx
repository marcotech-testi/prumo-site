import { ContentPage } from "@/components/sections/ContentPage";
import { sobre } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(sobre);

export default function Page() {
  return <ContentPage page={sobre} />;
}
