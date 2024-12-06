import { Button } from "@/components/ui/button";
import { getTemplates } from "@/lib/actions/template";
import TemplateGrid from "@/components/templates/template-grid";

export default async function HomePage() {
  const templates = await getTemplates();

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-center mb-4">
        Build Your Website with AI-Powered Templates
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-8">
        Choose from our curated collection of templates and customize them instantly with AI
      </p>
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Featured Templates</h2>
          <div className="flex gap-4">
            {/* Add filter controls here */}
          </div>
        </div>
        <TemplateGrid templates={templates} />
      </div>
    </div>
  );
}