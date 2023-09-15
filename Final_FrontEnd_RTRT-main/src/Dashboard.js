import React,{useState, useEffect} from 'react'
import AdminDashboard from './AdminDashboar'
import Logout from './Logout'
import UserDetail from './UserDetail'
import jwt_decode from "jwt-decode";
import { useAuth } from './services/AuthContext';


function Dashboard() {
    const [loggedIn, setLoggedIn] = useState(false);
    const {token} = useAuth();
    const [role, setRole] = useState("");
    
    
    useEffect(()=>{
        if(token !== "undefined"){
        const decodedToken = jwt_decode(token);
        setRole(decodedToken.role);
        setLoggedIn(true)
    }
    },[token])
    
  return (
    <>
    {/* {loggedIn && <Logout />} */}
    {role === "ROLE_ADMIN" ?  <AdminDashboard/> : <UserDetail/>}
    </>
    
  )
}

export default Dashboard