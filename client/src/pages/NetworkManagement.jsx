import React from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'

const NetworkManagement = () => {
  const user = JSON.parse(localStorage.getItem("user"))

 const roleToSidebar = {
  "Peasant": <Peasant_Navbar />,
  "CEO": <CEONavbar />,
  "I": <Chamber_I_Navbar />,
  "II": <Chamber_II_Navbar />,
  "III": <Chamber_III_Navbar />,
  "Team Amea": <TeamAmea_Navbar />,
  
}

const sidebar = user
  ? Object.entries(roleToSidebar).find(([key]) => user.role.includes(key))?.[1] || <TeamAmea_Navbar />
  : <TeamAmea_Navbar />
  return (
    <DashboardLayout sidebar={sidebar}>
    <div>NetworkManagement</div>
    </DashboardLayout>
  )
}

export default NetworkManagement