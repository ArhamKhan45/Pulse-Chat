import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <LoaderIcon className="size-12 animate-spin text-card" />
    </div>
  );
}
export default PageLoader;
