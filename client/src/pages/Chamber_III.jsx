import React, { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { Chamber_III_Navbar } from '../components/sidebars/Chamber_III_Navbar'
import { io } from 'socket.io-client'

const socket = io("http://localhost:5000")

const Chamber_I = ({ chamber }) => {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [user, setUser] =useState(null)
  
  const messagesEndRef = useRef(null)

  useEffect(()=>{
    if(messagesEndRef.current){
      messagesEndRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[chat])

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    setUser(storedUser)

    fetch(`http://localhost:5000/api/messages/${chamber}`).then((res)=>res.json()).then((data)=>setChat(data))

    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data])

    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [chamber])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage ={
        sender: user.name, 
        message: message.trim(),
        chamber: chamber,
      }
      socket.emit("sendMessage", newMessage)
      setMessage("")
    }
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    sendMessage()
  }
  return (

    <DashboardLayout sidebar={<Chamber_III_Navbar/>}>
    <div className="bg-white min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <h2 className="text-xl font-bold mb-4">Chamber {chamber} Chat</h2>
      <div className="h-[100vh] overflow-y-scroll border p-2 rounded mb-4">
      {chat.map((msg, idx)=>{
        const isSender = msg.sender === user?.name;

        return(
          <div
          key={idx}
          className={`flex ${isSender? "justify-end": "justify-start"} mb-2`} 
          >
            <div
            className={`max-w-[70%] px-4 py-2 rounded-lg ${
              isSender? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
            >
              {!isSender && (
                <div className='text-sm font-semibold mb-1'>{msg.sender}</div>
              )}
            <div>{msg.message}</div>
            </div>
          </div>
        )
      })}
            <div ref={messagesEndRef}/>

      </div>
  
        <form onSubmit={handleSubmit} className='flex gap-2' >
          <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message"
          autoFocus
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
        </form>
        
      </div>
 
    </ DashboardLayout >
  )
}


export default Chamber_I
