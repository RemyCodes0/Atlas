import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CEO_Dashboard from "./components/CEO_Dashboard"
import Layout from './components/Layout'
import Chamber_I from './pages/Chamber_I'
import Chamber_II from "./pages/Chamber_II"
import Chamber_III from "./pages/Chamber_III"
import TeamAmea from "./pages/TeamAmea"
import Tasks from "./pages/Tasks"
import Meetings from "./pages/Meetings"
import Fire from "./pages/Fire"
import UserProfiles from './pages/UserProfiles'
import CurationSystem from './pages/CurationSystem'
import NetworkManagement from './pages/NetworkManagement'
import Profile from './pages/Profile'
import { Toaster } from "sonner"
import TaskDetails from './pages/TaskDetails'
import TaskList from './pages/TaskList'


function App() {

  return (
 
  <>
   <Routes>
   <Route path='/register' element={<Signup />}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/chamber_i' element={<Chamber_I chamber="1"/>}/>
    <Route path='/chamber_ii' element={<Chamber_II chamber="2"/>}/>
    <Route path='/chamber_iii' element={<Chamber_III chamber="3"/>}/>
    <Route path='/team-amea' element={<TeamAmea chamber="team"/>}/>
    <Route path='/tasks' element={<Tasks/>}/>
    <Route path='/meetings' element={<Meetings/>}/>
    <Route path='/fire' element={<Fire/>}/>
    <Route path='/user-profiles' element={<UserProfiles/>}/> 
     <Route path='/ceo-dashboard' element={<CEO_Dashboard/>}/> 
     <Route path='/curation-system' element={<CurationSystem/>}/> 
     <Route path='/network-management' element={<NetworkManagement/>}/> 
     <Route path='/profile' element={<Profile/>}/> 
     <Route path='/task-details/:taskId' element={<TaskDetails/>}/> 
     <Route path='/task-list' element={<TaskList/>}/> 
 
  </Routes>
  <Toaster richColors position='top-right'/>
  </>
  )
}

export default App

