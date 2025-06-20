// layouts/CEOLayout.jsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { CEONavbar } from "@/components/sidebars/CEONavbar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const CEOLayout = ({ children }) => (
  <SidebarProvider>
    <CEONavbar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">CEO Dashboard</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>
);
