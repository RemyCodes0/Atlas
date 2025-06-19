import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

const ProtectedChamberRoute = ({user, children}) => {
    const {chamber} = useParams();

    if(!user){
        return <Navigate to="/login"/>
    }

    if(user.assignedChamber !== chamber){
        return <Navigate to={`/chamber/${user.assignedChamber}`} replace/>
    }
  return children
}

export default ProtectedChamberRoute