import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Chambers",
      url: "#",
      items: [
        {
          title: "Chamber I",
          url: "/chamber_i",
        },
        {
          title: "Chamber II",
          url: "/chamber_ii",
        },
        {
          title: "Chamber III",
          url: "/chamber_iii",
        },
        {
          title: "Team Amea",
          url: "/team-amea",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      items: [
        {
          title: "User Profiles",
          url: "/user-profiles",
        },
        {
          title: "Fire",
          url: "/fire",
        },
      ],
    },
    {
      title: "Amea Management",
      url: "#",
      items: [
        {
          title: "Task Management",
          url: "/task-management",
        },
        {
          title: "Meetings",
          url: "/meetings",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
    
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
