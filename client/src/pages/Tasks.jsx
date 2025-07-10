"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, User, Clock, Loader } from "lucide-react"
import { format, parseISO } from "date-fns"
import axios from "axios"
import { useEffect } from "react"
import { Chamber_I_Navbar } from '../components/sidebars/Chamber_I_Navbar'
import { Chamber_II_Navbar } from '../components/sidebars/Chamber_II_Navbar'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { Peasant_Navbar } from '../components/sidebars/Peasant_Navbar'
import { CEONavbar } from '../components/sidebars/CEONavbar'
import { TeamAmea_Navbar } from '../components/sidebars/TeamAmea_Navbar'
import DashboardLayout from "../layout/DashboardLayout"
import { Loader2 } from "lucide-react"



export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  })
  const simpleUrl = import.meta.env.SIMPLE_API_URL;
  const [selectedExplanation, setSelectedExplanation] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
    })
  }
  const [user, setUser] = useState()
  const [loader, setLoader] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL;



useEffect(() => {
  const actualUser = localStorage.getItem("user")
  if (actualUser) {
    setUser(JSON.parse(actualUser))
  }
}, [])
  const token = localStorage.getItem("authToken")

  useEffect(()=>{
    const fetchUsers = async()=>{
     
      try{
        const res = await axios.get(`${apiUrl}/auth/listUsers`,{
          headers: {Authorization: `Bearer ${token}`}
        })
        setTeamMembers(res.data.users||[])
      }catch(err){
        console.log("The server had an error", err)
        alert("The server had an error"+ err)
      }
    }
    fetchUsers()
  },[])

  useEffect(()=>{
    const fetchTask =async()=>{

      try{
        setLoader(true)
        const res = await axios.get(`${apiUrl}/tasks/assignedTasks`,{
        headers:{Authorization: `Bearer ${token}`}
      })
      setTasks(res.data)
      setLoader(false)
      }catch(err){
        console.error("Tasks not fetched", err)
        alert("tasks not fetched")
        setLoader(false)
      }
     
    }
    fetchTask()
  },[])

  const handleCreateTask = async() => {
    if (!formData.title || !formData.assignedTo || !formData.dueDate) return
    try{
 const res = await axios.post(`${apiUrl}/tasks/createTasks`, formData, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    setTasks([...tasks, res.data])
    
    resetForm()
    setIsCreateDialogOpen(false)
    console.log("Task created")
    }catch(err){
      console.error("The server had a problem", err)
      alert("The server had a problem"+ err)
    }
  }
const handleEditTask = (task) => {
  setEditingTask(task)
  setFormData({
    title: task.title || "",
    description: task.description || "",
    assignedTo: task.assignedTo || "",
    dueDate: task.dueDate|| "",
  })
}

const formatDateForInput = (isoDate) => {
  if (!isoDate) return ""

  const parsed = parseISO(isoDate)
  if (isNaN(parsed.getTime())) return ""

  return format(parsed, "yyyy-MM-dd")
}


const handleUpdateTask = async (e) => {
  e?.preventDefault?.()
  if (!editingTask || !formData.title || !formData.assignedTo || !formData.dueDate) return

  try {
    
    const res = await axios.put(
      `${apiUrl}/tasks/updateTask/${editingTask._id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === editingTask._id ? res.data.updatedTask || res.data.task || res.data : task
      )
    )
    resetForm()
    setEditingTask(null)
  } catch (err) {
    console.error("Update failed", err)
    alert("Update failed: " + err?.response?.data?.message || err.message)
  }
}

  const handleDeleteTask = async(taskId) => {
    
    try{
   const res = await axios.delete(`${apiUrl}/tasks/deleteTask/${taskId}`,
    {
      headers: {Authorization: `Bearer ${token}`}
    }
   )
    setTasks(tasks.filter((task) => task._id !== res.data._id))
    }catch(err){
       console.error("Failed to delete task", err)
    alert("Failed to delete task"+ err)
    }
 
  }

 const handleStatusChange = async (taskId, newStatus) => {
  try {
    await axios.put(`${apiUrl}/tasks/updateTask/${taskId}`, {
      status: newStatus,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setTasks((prev) =>
      prev.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
    );
  } catch (err) {
    console.error("Failed to update status", err);
    alert("Failed to update status");
  }
};


  const getMemberById = (id) => {

    return teamMembers.find((member) => member._id === id)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
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
        {loader?(
        <div className="flex justify-center items-center">
                          <Loader2 className="h-10 w-10 animate-spin text-primary"/>
        </div>
        ):
        (
<div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
      
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task and assign it to a team member.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assign to</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formatDateForInput(formData.dueDate)}
                  onChange={(e) =>{
                    const newDate = new Date(e.target.value)
const isoString = newDate.toISOString()
setFormData({ ...formData, dueDate: isoString })

                  } }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">Create your first task to get started</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => {
            const assignedMember = getMemberById(task.assignedTo)
            const overdue = isOverdue(task.dueDate)

            return (
              <Card key={task._id} className={`transition-all hover:shadow-md ${overdue ? "border-red-200" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                        {overdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">{task.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{task.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTask(task._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={assignedMember?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {task.assignedTo?.name?.split(" ").map((n) => n[0]).join("") || ""}

                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{task.assignedTo?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className={`text-sm ${overdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                          Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                   <div className="flex flex-row gap-2">
   {task.status === "completed" && (
  <Dialog>
    <DialogTrigger asChild>
      <button
        className="border px-3 py-1 rounded-full font-bold bg-blue-200 text-blue-900"
        onClick={() => setSelectedExplanation(task.proofFiles || [])}
      >
        Explanations
      </button>
    </DialogTrigger>

    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Explanation</DialogTitle>
        <DialogDescription asChild>
          <div className="space-y-4">
            {selectedExplanation.length === 0 ? (
              <p>No explanations provided.</p>
            ) : (
              selectedExplanation.map((file, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md bg-gray-50 shadow-sm text-sm space-y-1"
                >
                  <p><strong>Type:</strong> {file.type}</p>
                  {file.type === "text" ? (
  <p><strong>Content:</strong> {file.content}</p>
) : file.type === "image" ? (
  <img
    src={`${simpleUrl}${file.content}`}
    alt={file.content}
    className="max-w-full h-auto rounded"
  />
) : file.type === "video" ? (
  <video
    controls
    className="w-full max-h-[400px] rounded"
    src={`${simpleUrl}${file.content}`}
  />
) : (
  <a
    href={`${simpleUrl}${file.content}`}
    download
    className="text-blue-600 underline"
  >
    Download File
  </a>
)}

                <a
    href={`${simpleUrl}${file.content}`}
    download
    className="text-blue-600 underline"
  >
    Download File
  </a>  
                  {file.description && <p><strong>Description:</strong> {file.description}</p>}
                  {file.uploadedAt && (
                    <p>
                      <strong>Uploaded:</strong>{" "}
                      {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                  )}
                  {file.completedAt && (
                    <p>
                      <strong>Completed:</strong>{" "}
                      {new Date(file.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
)}
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task._id, value)}
                    >
     
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in progress">In progress</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    </div>             
                     
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Edit Task Dialog */}
     <Dialog
  open={!!editingTask}
  onOpenChange={(isOpen) => {
    if (!isOpen) {
      setEditingTask(null);
      resetForm();
    }
  }}
>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to the task details.</DialogDescription>
          </DialogHeader>
           <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdateTask(e);
      }}
      className="grid gap-4 py-4"
    >
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-assignedTo">Assign to</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateTask}>Update Task</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
        )

        }
    
    </DashboardLayout>
  )
}
