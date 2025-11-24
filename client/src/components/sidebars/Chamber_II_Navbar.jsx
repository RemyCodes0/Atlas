import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { VersionSwitcher } from "../version-switcher";

export function Chamber_II_Navbar() {
    const user = JSON.parse(localStorage.getItem("user"))
  const role = user.role;
  const canAccessTasks = role.includes("President") || role.includes("Vice")
  return (
    <Sidebar>
      <SidebarHeader>
        <VersionSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/chamber_ii">💬Chat</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/profile">🧑Profile</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/team-amea">❌Team Amea</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/notification_list">💡Notifications</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/task-list">📑Tasks</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {
  canAccessTasks && (
    
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/tasks">✍️Tasks Management</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
  )
}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
