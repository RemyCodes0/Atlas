"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Camera, Save, Users, X } from "lucide-react"
import axios from "axios"
import DashboardLayout from '../layout/DashboardLayout'
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.imageUrl,
    role: user.role,
    department: user.role,
  })
  const token = localStorage.getItem("authToken")
const apiUrl = import.meta.env.VITE_API_URL;



 
  const [formData, setFormData] = useState({})

  useEffect(()=>{
    setFormData({
      name: userData.name,
      email: userData.email,
    })
  }, [userData])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result 
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)

    // Simulate API call
     setUserData({
      ...userData,
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    })
    try{
      const res = await axios.put(`${apiUrl}/user/profile`, userData ,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      localStorage.setItem("user", JSON.stringify({
  ...user,
  name: formData.name,
  email: formData.email,
  imageUrl: formData.avatar,
}))

    setLoading(false)
    }catch(err){
      console.error("There was an error", err)
      alert("There was an error"+ err)
      setLoading(false)
    }

   

    setIsEditing(false)
    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
    })
    setIsEditing(false)
  }

  const getInitials = (firstName) => {
    return `${firstName.charAt(0)}`.toUpperCase()
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={isEditing ? formData.avatar : userData.avatar} alt="Profile picture" />
                <AvatarFallback className="text-2xl">
                  {getInitials(
                    isEditing ? formData.name : userData.name,
                    
                  )}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Camera className="h-8 w-8 text-white" />
                    <span className="sr-only">Upload new avatar</span>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              )}
            </div>
            {isEditing && (
              <p className="text-sm text-muted-foreground text-center">Click the camera icon to upload a new photo</p>
            )}
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="px-3 py-2 bg-muted w-full rounded-md">{userData.name}</div>
                )}
              </div>
             
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">{userData.email}</div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{userData.role}</Badge>
                  </div>
                </div>
                
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
     
    </div>
    </DashboardLayout>
  )
}
