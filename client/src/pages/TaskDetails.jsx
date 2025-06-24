import axios from 'axios'
import React, { useEffect, useState } from 'react'

const TaskDetails = ({ taskId }) => {
  const [task, setTask] = useState(null)
  const [status, setStatus] = useState("completed")
  const [textProof, setTextProof] = useState("")
  const [explanation, setExplanation] = useState("")
  const [proofFiles, setProofFiles] = useState([])
  const token = localStorage.getItem("authToken")

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTask(res.data)
      } catch (err) {
        console.error("Error fetching task", err)
        alert("Failed to fetch task details")
      }
    }
    fetchTask()
  }, [taskId])

  const handleFileChange = (e) => {
    setProofFiles(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("status", status)
    formData.append("textProof", textProof)
    formData.append("explanation", explanation)
    for (let i = 0; i < proofFiles.length; i++) {
      formData.append("proofFiles", proofFiles[i])
    }

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      alert("Task updated successfully!")
    } catch (err) {
      console.error("Failed to update task", err)
      alert("Error submitting task proof")
    }
  }

  if (!task) return <div>Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Task: {task.title}</h2>
      <p className="mb-4">{task.description}</p>
      <p className="mb-4">
        <strong>Due Date:</strong>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
      </p>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="completed">Mark as Completed</option>
          <option value="rejected">Reject Task</option>
        </select>

        <label className="block mb-2">Write Explanation or Proof:</label>
        <textarea
          value={status === "rejected" ? explanation : textProof}
          onChange={(e) =>
            status === "rejected"
              ? setExplanation(e.target.value)
              : setTextProof(e.target.value)
          }
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Upload Images/Videos:</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Submit Proof
        </button>
      </form>
    </div>
  )
}

export default TaskDetails
