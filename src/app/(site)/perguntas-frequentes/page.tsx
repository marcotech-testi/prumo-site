import { ContentPage } from "@/components/sections/ContentPage";
import { perguntasFrequentes } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(perguntasFrequentes);

export default function Page() {
  return <ContentPage page={perguntasFrequentes} />;
}
