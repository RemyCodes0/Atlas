// import axios from 'axios'
// import React, { useEffect, useState } from 'react'

// const Profile = () => {
//   const [user, setUser] = useState(null)
//   const [form, setForm]= useState({})
//   const [editMode, setEditMode] = useState({})

//   useEffect(()=>{
//     const token = localStorage.getItem("authToken")
//     axios.get("http://localhost:5000/api/user/profile", {
//       headers:{
//         Authorization: `Bearer ${token}`
//       }
//       }).then(res=>{
//         setUser(res.data)
//         setForm(res.data)
//     })
//   }, [])

//   const handleChange=(e)=>{
//     setForm({...form, [e.target.name]:e.target.value})
//   }

//   const handleUpdate = async()=>{
//     const token = localStorage.getItem('authToken')
//     const res = await axios.put("http://localhost:5000/api/user/profile",form,{
//       headers: {Authorization: `Bearer ${token}` }
//     })
//     setUser(res.data)
//     setEditMode(false)
//   }

//   const handleDelete = async()=>{
//     const token = localStorage.getItem("authToken")
//     await axios.delete("http://localhost:5000/api/user/profile",{
//       headers: {Authorization: `Bearer ${token}`}
//     })
//     localStorage.removeItem("authToken")
//     localStorage.removeItem("user")
//     window.location.href ="/login"
//   }
//   console.log(user)
//   return (
//    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
//       <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

//       <label className="block mb-2">Name:</label>
//       <input
//         type="text"
//         name="name"
//         value={form.name}
//         onChange={handleChange}
//         disabled={!editMode}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <label className="block mb-2">Email:</label>
//       <input
//         type="email"
//         name="email"
//         value={form.email}
//         onChange={handleChange}
//         disabled={!editMode}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <label className="block mb-2">Role:</label>
//       <input
//         type="text"
//         name="role"
//         value={form.role}
//         onChange={handleChange}
//         disabled
//         className="w-full p-2 border rounded mb-4 bg-gray-100"
//       />

//       <div className="flex gap-4">
//         {!editMode ? (
//           <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
//         ) : (
//           <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
//         )}
//         <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete Account</button>
//       </div>
//     </div>
//   )
// }

// export default Profile
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
      const res = await axios.put("http://localhost:5000/api/user/profile", userData ,{
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
            <div className="grid gap-4 md:grid-cols-2">
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
                  <div className="px-3 py-2 bg-muted rounded-md">{userData.name}</div>
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
