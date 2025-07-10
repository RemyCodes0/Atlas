"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Bell, Filter } from "lucide-react"
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import DashboardLayout from '../layout/DashboardLayout'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'
import Linkify from "linkify-react"

import { Button } from "@/components/ui/button"
import axios from "axios"



const options = {
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-blue-600 underline",
}



export default function UserNotifications() {



  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const token = localStorage.getItem("authToken")
  const user = JSON.parse(localStorage.getItem("user"))
const apiUrl = import.meta.env.VITE_API_URL;
const simpleUrl = import.meta.env.VITE_SIMPLE_API_URL;
    useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${apiUrl}/notification`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        const dataWithDates = res.data.map((n)=>({
            ...n,
            createdAt: new Date(n.createdAt)
        }))
        setNotifications(dataWithDates);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const filtered = notifications.filter((notification) =>
      notification.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    })

    setFilteredNotifications(filtered)
  }, [searchTerm, sortOrder, notifications])

  const formatDate = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      if (diffInHours < 1) return "Just now"
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 17) return "afternoon"
    return "evening"
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Amea Notifications</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Good {getTimeOfDay()}! Stay updated with the latest Amea announcements
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortOrder === "newest" ? "default" : "outline"}
              onClick={() => setSortOrder("newest")}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Newest First
            </Button>
            <Button
              variant={sortOrder === "oldest" ? "default" : "outline"}
              onClick={() => setSortOrder("oldest")}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Oldest First
            </Button>
          </div>
        </div>

        {/* Notifications Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Updates</h2>
          <Badge variant="secondary" className="text-sm">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Check back later for updates"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredNotifications.map((notification, index) => (
              <Card key={notification._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <Linkify options={options}>
               
                <div className="md:flex">
                  <div className="md:w-1/3 relative h-48 md:h-auto">
                    <img
                      src={`${simpleUrl}${notification.imageUrl}`}
                      alt="Notification image"
                      
                      className="object-cover h-full rounded ml-1.5"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(notification.createdAt)}
                        </div>
                        {index === 0 && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Latest</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 leading-relaxed text-base line-clamp-10">{notification.description}</p>
                    </CardContent>
                  </div>
                </div>
                 </Linkify>
              </Card>
            ))}
          </div>
        )}


      </div>
    </div>
    </DashboardLayout>
  )
}

