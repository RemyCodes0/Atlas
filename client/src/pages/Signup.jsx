import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import logo from "../assets/logo-rm.png"
import { Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({name: "", email:"", password:""});
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    }catch(err){
      alert("Registration failed"+ err.response?.data?.msg || err.message)
    }
  }




  return (
    
  <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 p-6 flex justify-center items-center overflow-hidden">

    {/* Background Logo Image */}
    <img
      src={logo}
      alt="Logo Background"
      className="absolute opacity-50 w-[1000px] max-w-lg"
      style={{top: "50%", left: "50%", transform: "translate(-40%, -38%)", scale: 1.3 }}
    />

    {/* Signup Form */}
    <div className="p-6 bg-white shadow-xl mx-auto min-w-[300px] sm:min-w-[400px] rounded-xl z-10">
      <h1 className="text-xl font-extrabold text-center mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-1">Username</label>
        <input
          type="text"
          value={form.name}
          name="name"
          placeholder="Username"
          onChange={handleChange}
          required
          className="border mb-4 rounded p-2"
        />

        <label className="mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="border mb-4 rounded p-2"
        />

        <label className="mb-1">Password</label>
        <input
          type="password"
          value={form.password}
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="border mb-1 rounded p-2"
        />

        <p className='mb-10'>
          Already have an account? <span className='underline text-red-900'><Link to="/login">login</Link></span>
        </p>

        <button
          type="submit"
          className="border rounded bg-red-700 text-white p-2 text-lg hover:bg-red-800"
        >
          Register
        </button>
      </form>
    </div>
  </div>


  )
}

export default Signup