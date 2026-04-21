import { PageContainer } from "@/components/layout/page-shell";
import { UploadPanel } from "@/components/dashboard/upload-panel";

export default function GeneratePage() {
  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-12">
        <UploadPanel />
      </div>
    </PageContainer>
  );
}
