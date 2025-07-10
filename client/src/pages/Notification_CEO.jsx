"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import DashboardLayout from '../layout/DashboardLayout'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'
import { Upload, Calendar, FileText, ImageIcon, Trash2 } from "lucide-react"
import axios from "axios"
import Linkify from "linkify-react";

const options = {
  target: "_blank",
  rel: "noopener noreferrer",
  className: "text-blue-600 underline", 
};

export default function Component() {
  const [notifications, setNotifications] = useState([])
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const token = localStorage.getItem("authToken")
  const user = JSON.parse(localStorage.getItem("user"))
  const apiUrl = import.meta.env.VITE_API_URL;
const simpleUrl = import.meta.env.SIMPLE_API_URL;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${apiUrl}/notification`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !description.trim()) {
      alert("Image and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(`${apiUrl}/notification`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const newNotification = res.data
      setNotifications((prev)=>[newNotification, ...prev])
      alert("Notification uploaded!");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null)

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };


  const handleDelete = async(id) => {

    try{
        const res = await axios.delete(`${apiUrl}/notification/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
    setNotifications((prev) => prev.filter((notification) => notification._id !== id))

    }catch(err){
        console.error("An error occured", err)
        alert("An error occured"+ err)
    }
  }

const formatDate = (date) => {
  const parsedDate = new Date(date)
  if (isNaN(parsedDate)) return "Invalid Date"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Amea|Atlas Notifications Dashboard</h1>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Create New Notification
            </CardTitle>
            <CardDescription>Upload a new notification with description and image</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter notification description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} required />
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border">
                      <img src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!description.trim() || !selectedFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Notification
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Notifications</h2>
            <Badge variant="secondary" className="text-sm">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">Upload your first notification to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notifications.map((notification) => (
                <Card key={notification._id} className="overflow-hidden">
                  <Linkify options={options}>
                  
                  <div className="relative h-48 w-full">
                    <img
                      src={`${simpleUrl}${notification.imageUrl}`}
                      alt="Notification"
                      className="w-full h-50"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(notification.createdAt)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-start gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm leading-relaxed line-clamp-3">{notification.description}</p>
                    </div>
                  </CardContent>
                  </Linkify>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
