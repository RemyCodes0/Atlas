import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [form, setForm]= useState({})
  const [editMode, setEditMode] = useState({})

  useEffect(()=>{
    const token = localStorage.getItem("authToken")
    axios.get("http://localhost:5000/api/user/profile", {
      headers:{
        Authorization: `Bearer ${token}`
      }
      }).then(res=>{
        setUser(res.data)
        setForm(res.data)
    })
  }, [])

  const handleChange=(e)=>{
    setForm({...form, [e.target.name]:e.target.value})
  }

  const handleUpdate = async()=>{
    const token = localStorage.getItem('authToken')
    const res = await axios.put("http://localhost:5000/api/user/profile",form,{
      headers: {Authorization: `Bearer ${token}` }
    })
    setUser(res.data)
    setEditMode(false)
  }

  const handleDelete = async()=>{
    const token = localStorage.getItem("authToken")
    await axios.delete("http://localhost:5000/api/user/profile",{
      headers: {Authorization: `Bearer ${token}`}
    })
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.location.href ="/login"
  }
  console.log(user)
  return (
   <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <label className="block mb-2">Name:</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        disabled={!editMode}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2">Email:</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        disabled={!editMode}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2">Role:</label>
      <input
        type="text"
        name="role"
        value={form.role}
        onChange={handleChange}
        disabled
        className="w-full p-2 border rounded mb-4 bg-gray-100"
      />

      <div className="flex gap-4">
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
        ) : (
          <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        )}
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete Account</button>
      </div>
    </div>
  )
}

export default Profile