"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, User, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import DashboardLayout from '../layout/DashboardLayout'
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'
import axios from "axios"
import { Link } from "react-router-dom";

export default function CurationsPage() {
  const [curations, setCurations] = useState([])
  const token = localStorage.getItem("authToken")
const apiUrl = import.meta.env.VITE_API_URL;

useEffect(()=>{
  const fetchCurations = async()=>{
    try{
      const res = await axios.get(`${apiUrl}/curate/curation`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const parsed = res.data.curation.map((c)=>({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }))
      setCurations(parsed)
    }catch(err){
      console.log("An error occured: ", err)
      alert("There was an error with the server"+ err)
    }
  }
  fetchCurations()
}, [])

  const deleteCuration = async(id) => {
    // const updatedCurations = curations.filter((c) => c.id !== id)
    // setCurations(updatedCurations)
    // localStorage.setItem("curations", JSON.stringify(updatedCurations))
    try{
      console.log(id)
      const res = await axios.delete(`${apiUrl}/curate/curation/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    const updatedCurations = curations.filter((c) => c._id !== id)
    setCurations(updatedCurations)
    }catch(err){
      console.error("An error occured", err)
      alert("an error has happened"+ err)
    }
  }

  const stripHtml = (html) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curations</h1>
        </div>
        <a href="/editor">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Curation
          </Button>
       </a>
      </div>

      {curations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No curations yet</h3>
                <p className="text-muted-foreground">Get started by creating your first curation</p>
              </div>
              <a href="/editor">
                <Button>Create Curation</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {curations.map((curation) => (
            <Card key={curation._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{curation.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {stripHtml(curation.content).substring(0, 200)}...
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link to={`/editor/${curation._id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => deleteCuration(curation._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{curation.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Created {formatDistanceToNow(curation.createdAt, { addSuffix: true })}</span>
                  </div>
                  {curation.updatedAt.getTime() !== curation.createdAt.getTime() && (
                    <Badge variant="secondary" className="text-xs">
                      Updated {formatDistanceToNow(curation.updatedAt, { addSuffix: true })}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}
