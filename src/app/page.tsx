import { Hero } from "@/components/marketing/hero";
import { ProductFlow } from "@/components/marketing/product-flow";
import { PageContainer, Section } from "@/components/layout/page-shell";

export default function Home() {
  return (
    <PageContainer>
      <Hero />
      <Section
        eyebrow="Workflow"
        title="From source material to focused practice"
        description="A calm path for turning dense readings into review sessions that show what matters next."
      >
        <ProductFlow />
      </Section>
    </PageContainer>
  );
}
