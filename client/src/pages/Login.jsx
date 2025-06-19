import React from 'react'
import { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo-rm.png"
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Login = () => {
  const [form, setForm] = useState({email: "", password: ""})
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) =>{
    setForm({...form, [e.target.name]:e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoader(true)
    try{
    const res = await axios.post("http://localhost:5000/api/auth/login", form)
    const {token, user} = res.data

    localStorage.setItem("authToken", token)
    localStorage.setItem("user", JSON.stringify(user))
    switch(user.role){
      case "CEO":
        navigate("/ceo-dashboard");
        break;
      case "President-I":
        navigate("/chamber_i");
        break;
      case "President-II":
        navigate("/chamber_ii");
        break
      case "President-III":
        navigate("/chamber_iii");
        break
      case "Vice President-I":
        navigate("/chamber_i");
        break
      case "Vice President-II":
        navigate("/chamber_ii");
        break
      case "Vice President-III":
        navigate("/chamber_iii");
        break
      case "Member-I":
        navigate("/chamber_i");
        break
      case "Member-II":
        navigate("/chamber_ii");
        break
      case "Member-III":
        navigate("/chamber_iii");
        break
      case "Peasant":
        navigate("/team-amea");
        break
    }
    }catch(err){
     alert("Login failed: " + (err.response?.data?.msg || err.message))

    }finally{
      setLoader(false)
    }
  }
return (
  <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 p-6 flex justify-center items-center overflow-hidden">

    <img
      src={logo}
      alt="Logo Background"
      className="absolute opacity-50 w-[1000px] max-w-lg "
      style={{ top: "50%", left: "50%", transform: "translate(-40%, -38%)", scale: 1.3}}
    />
    <div className="p-6 bg-white shadow-xl mx-auto min-w-[300px] sm:min-w-[400px] rounded-xl z-10">
      <h1 className="text-xl font-extrabold text-center mb-9 text-gray-900">Welcome Back</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          className="border mb-4 rounded p-2 "
          onChange={handleChange}
          required
        />
        <label className="mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          className="border mb-2 rounded p-2"
          onChange={handleChange}
          required
        />
        <p className='mb-10'>Don't have an account <span className='underline text-red-900'><Link to="/register">signup</Link></span> </p>
        <button
          type="submit"
          className="border rounded bg-red-700 text-white p-2 text-2xl mb-4 hover:bg-red-800" disabled={loader}
        >
          {loader?
          <div className='flex justify-center items-center'>
            <Loader2/>
          </div>
           
           : "Login"}
         
        </button>
      </form>
    </div>
  </div>
)

}

export default Login

