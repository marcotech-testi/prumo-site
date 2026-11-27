import { ContentPage } from "@/components/sections/ContentPage";
import { irrigacao } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(irrigacao);

export default function Page() {
  return <ContentPage page={irrigacao} />;
}
