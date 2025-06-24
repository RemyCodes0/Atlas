// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'

// const TaskList = () => {
//     const [tasks, setTasks] = useState([])
//     const token = localStorage.getItem("authToken")

//     useEffect(()=>{
//         const fetchTasks = async()=>{
//             try{
//                 const res = await axios.get("http://localhost:5000/api/tasks/my-tasks",{
//                     headers: {Authorization: `Bearer ${token}`}
//                 })
//             setTasks(res.data || [])
//             }catch(err){
//                 console.error("Failed to fetch tasks", err)
//                 alert("Error fetching your assigned tasks")
//             }
//         }
//         fetchTasks()
//     }, [])

//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       <h1 className="text-3xl font-bold mb-6">My Assigned Tasks</h1>
//       {tasks.length === 0 ? (
//         <p>No tasks assigned yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {tasks.map((task) => (
//             <div key={task._id} className="p-4 border rounded shadow-sm bg-white">
//               <h2 className="text-xl font-semibold">{task.title}</h2>
//               <p className="text-gray-600 mb-1">{task.description}</p>
//               <p className="text-sm text-gray-500 mb-2">
//                 Due: {new Date(task.dueDate).toLocaleDateString()} | Status:{" "}
//                 <span
//                   className={
//                     task.status === "completed"
//                       ? "text-green-600"
//                       : task.status === "rejected"
//                       ? "text-red-600"
//                       : "text-yellow-600"
//                   }
//                 >
//                   {task.status}
//                 </span>
//               </p>
//               <Link
//                 to={`/tasks/${task._id}`}
//                 className="text-blue-600 underline"
//               >
//                 View & Submit Proof
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default TaskList
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User, Upload, CheckCircle, XCircle, AlertCircle, Camera, FileText, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import { useEffect } from "react"



export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [proofText, setProofText] = useState("")
  const [proofDescription, setProofDescription] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showProofDialog, setShowProofDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const token = localStorage.getItem("authToken")

  useEffect(()=>{
    const fetchTasks = async()=>{
      try{
        const res = await axios.get("http://localhost:5000/api/tasks/my-tasks",{
          headers: {Authorization: `Bearer ${token}`}
        })
        console.log("Fetch task response", res.data)
        setTasks(res.data)

      }catch(err){
        console.error("There was an error while getching tasks", err)
        alert("An error accorded"+ err)
      }
    }
    fetchTasks()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = tasks.filter((task) => statusFilter === "all" || task.status === statusFilter)

  const handleStatusChange = (taskId, newStatus) => {
    if (newStatus === "completed" && selectedTask && (!selectedTask.proofs || selectedTask.proofs.length === 0)) {
      alert("Please provide proof before marking the task as completed.")
      return
    }

    setTasks(tasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)))

    if (selectedTask) {
      setSelectedTask({ ...selectedTask, status: newStatus})
    }
  }

  const handleAddProof = (type) => {
    if (!selectedTask) return

    if (type === "text" && !proofText.trim()) {
      alert("Please enter proof text.")
      return
    }

    const newProof = {
      id: Date.now().toString(),
      type,
      content: type === "text" ? proofText : `${type}-file-${Date.now()}`,
      description: proofDescription,
      uploadedAt: new Date().toISOString(),
    }

    const updatedTask = {
      ...selectedTask,
      proofs: [...(selectedTask.proofs || []), newProof],
    }

    setTasks(tasks.map((task) => (task._id === selectedTask.id ? updatedTask : task)))
    setSelectedTask(updatedTask)
    setProofText("")
    setProofDescription("")
    setShowProofDialog(false)
  }

  const handleRejectTask = () => {
    if (!selectedTask || !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.")
      return
    }

    const updatedTask = {
      ...selectedTask,
      status: "rejected",
      rejectionReason,
    }

    setTasks(tasks.map((task) => (task._id === selectedTask.id ? updatedTask : task)))
    setSelectedTask(updatedTask)
    setRejectionReason("")
    setShowRejectDialog(false)
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
        <p className="text-muted-foreground">Manage your assigned tasks and submit proof of completion</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate)
          const isOverdue = daysUntilDue < 0
          const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0

          return (
            <Card
              key={task._id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                isOverdue ? "border-red-200" : isDueSoon ? "border-orange-200" : ""
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{task.assignedBy.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span
                      className={
                        isOverdue ? "text-red-600 font-medium" : isDueSoon ? "text-orange-600 font-medium" : ""
                      }
                    >
                      {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue && " (Overdue)"}
                      {isDueSoon && !isOverdue && " (Due Soon)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                    {task.proofs && task.proofs.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4" />
                        <span>{task.proofs.length} proof(s)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground">No tasks match the current filter.</p>
        </div>
      )}

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTask.title}</DialogTitle>
                <DialogDescription>
                  Assigned by {selectedTask.assignedBy.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Task Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                  </div>
                  <Badge className={getStatusColor(selectedTask.status)} variant="secondary">
                    {selectedTask.status.replace("-", " ")}
                  </Badge>
                 
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                </div>

                {/* Rejection Reason */}
                {selectedTask.status === "rejected" && selectedTask.rejectionReason && (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Rejection Reason:</strong> {selectedTask.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Proofs Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Proof of Completion</h4>
                    {selectedTask.status !== "completed" && selectedTask.status !== "rejected" && (
                      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Add Proof
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Proof</DialogTitle>
                            <DialogDescription>Provide evidence of task completion</DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="text" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="text">
                                <FileText className="w-4 h-4 mr-2" />
                                Text
                              </TabsTrigger>
                              <TabsTrigger value="image">
                                <Camera className="w-4 h-4 mr-2" />
                                Image
                              </TabsTrigger>
                              <TabsTrigger value="video">
                                <Video className="w-4 h-4 mr-2" />
                                Video
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="space-y-4">
                              <div>
                                <Label htmlFor="proof-text">Proof Description</Label>
                                <Textarea
                                  id="proof-text"
                                  placeholder="Describe what you've completed..."
                                  value={proofText}
                                  onChange={(e) => setProofText(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="proof-desc">Additional Notes (Optional)</Label>
                                <Input
                                  id="proof-desc"
                                  placeholder="Any additional context..."
                                  value={proofDescription}
                                  onChange={(e) => setProofDescription(e.target.value)}
                                />
                              </div>
                              <Button onClick={() => handleAddProof("text")} className="w-full">
                                Add Text Proof
                              </Button>
                            </TabsContent>
                            <TabsContent value="image" className="space-y-4">
                              <div>
                                <Label htmlFor="image-upload">Upload Image</Label>
                                <Input id="image-upload" type="file" accept="image/*" />
                              </div>
                              <div>
                                <Label htmlFor="image-desc">Description (Optional)</Label>
                                <Input
                                  id="image-desc"
                                  placeholder="Describe the image..."
                                  value={proofDescription}
                                  onChange={(e) => setProofDescription(e.target.value)}
                                />
                              </div>
                              <Button onClick={() => handleAddProof("image")} className="w-full">
                                Add Image Proof
                              </Button>
                            </TabsContent>
                            <TabsContent value="video" className="space-y-4">
                              <div>
                                <Label htmlFor="video-upload">Upload Video</Label>
                                <Input id="video-upload" type="file" accept="video/*" />
                              </div>
                              <div>
                                <Label htmlFor="video-desc">Description (Optional)</Label>
                                <Input
                                  id="video-desc"
                                  placeholder="Describe the video..."
                                  value={proofDescription}
                                  onChange={(e) => setProofDescription(e.target.value)}
                                />
                              </div>
                              <Button onClick={() => handleAddProof("video")} className="w-full">
                                Add Video Proof
                              </Button>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {selectedTask.proofFiles && selectedTask.proofFiles.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.proofFiles.map((proof) => (
                        <Card key={proof.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                {proof.type === "text" && <FileText className="w-4 h-4" />}
                                {proof.type === "image" && <Camera className="w-4 h-4" />}
                                {proof.type === "video" && <Video className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{proof.type}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(proof.uploadedAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{proof.content}</p>
                                {proof.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{proof.description}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No proof submitted yet.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedTask.status === "pending" && (
                    <Button onClick={() => handleStatusChange(selectedTask.id, "in-progress")} className="flex-1">
                      Start Task
                    </Button>
                  )}

                  {(selectedTask.status === "pending" || selectedTask.status === "in-progress") && (
                    <>
                      <Button
                        onClick={() => handleStatusChange(selectedTask._id, "completed")}
                        disabled={!selectedTask.proofFiles || selectedTask.proofFiles.length === 0}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>

                      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Task</DialogTitle>
                            <DialogDescription>Please provide a reason for rejecting this task.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                              <Textarea
                                id="rejection-reason"
                                placeholder="Explain why you're rejecting this task..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleRejectTask}>
                              Reject Task
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
