"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Save,
  ArrowLeft,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { toast } from "sonner"
import DashboardLayout from '../layout/DashboardLayout'
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'
import axios from "axios"
import { useParams } from "react-router-dom"
import Linkify from "linkify-react"



const options ={
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-600 underline",
}


export default function Editor() {
  const router = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const editorRef = useRef(null)
  const token = localStorage.getItem("authToken")
  const {id: editingId} = useParams()
  console.log("Editing ID:", editingId)

  useEffect(()=>{
    if(!editingId) return 
    const fetchCuration = async ()=>{
        try{
            const token = localStorage.getItem("authToken")
            const res = await axios.get(`http://localhost:5000/api/curate/curation/${editingId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const curation = res.data.curation
            setTitle(curation.title)
         
            setContent(curation.content)
            if(editorRef.current){
                editorRef.current.innerHTML = curation.content
            }
        }catch(err){
            console.error("Failed to load curation", err)
        }
    }
    fetchCuration()
  }, [editingId])



  const executeCommand = (command, value) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }
  const handleSave = async() => {
    if (!title.trim()) {
      toast.error("Please fill in title ")
      return
    }

    const currentContent = editorRef.current?.innerHTML || ""
     const payload = {
    title,
    user: user.name,
    content: currentContent,
  }

  try{
    if (editingId){
        const response = await axios.put(`http://localhost:5000/api/curate/curation/${editingId}`,payload, {
            headers: {Authorization: `Bearer ${token}`},
        })
   
            toast.success("curation upadted successfully")
    }else{
        const response = await axios.post("http://localhost:5000/api/curate/curation",payload,{
            headers: {Authorization: `Bearer ${token}`},
        })
      
            toast.success("Curation created successfully!")

    }
    router("/curation-system")

  }catch(err){
    console.error(err)
    toast.error("An error occured while saving the curation")
  }
    
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router("/curation-system")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{editingId ? "Edit Curation" : "Create New Curation"}</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Curation Title</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter curation title..."
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Toolbar */}
            <div className="border rounded-t-lg p-3 bg-muted/50">
              <div className="flex flex-wrap gap-1">
                {/* Text Formatting */}
                <Button variant="ghost" size="sm" onClick={() => executeCommand("bold")} className="h-8 w-8 p-0">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("italic")} className="h-8 w-8 p-0">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => executeCommand("underline")} className="h-8 w-8 p-0">
                  <Underline className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Headings */}

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Alignment */}
                <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyLeft")} className="h-8 w-8 p-0">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeCommand("justifyCenter")}
                  className="h-8 w-8 p-0"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeCommand("justifyRight")}
                  className="h-8 w-8 p-0"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>

                <Separator orientation="vertical" className="mx-1 h-6" />

            
                {/* Font Size */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeCommand("fontSize", "4")}
                  className="h-8 px-2 text-xs"
                >
                  A+
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeCommand("fontSize", "2")}
                  className="h-8 px-2 text-xs"
                >
                  A-
                </Button>
              </div>
            </div>

            {/* Editor */}
            <Linkify options={options}>
              <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              className="min-h-[400px] p-4 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{ whiteSpace: "pre-wrap" }}
              suppressContentEditableWarning={true}
            />
            </Linkify>
          
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router("/curation-system")}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {editingId ? "Update Curation" : "Save Curation"}
          </Button>
        </div>
      </div>
    </div>

    </DashboardLayout>
  )
}













