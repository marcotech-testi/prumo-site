import { ContentPage } from "@/components/sections/ContentPage";
import { manutencao } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(manutencao);

export default function Page() {
  return <ContentPage page={manutencao} />;
}
