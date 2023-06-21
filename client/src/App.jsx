import React, {useContext} from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Auth from "./components/Auth.jsx"
import Profile from "./components/Profile.jsx"
import Public from "./components/Public.jsx"
import { UserContext } from "../context/UserProvider.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"


export default function App() {
  const {token, logout} = useContext(UserContext)
  // console.log(user)
    return (
      <div className="app">
      <Navbar token={token} logout={logout} />
    <Routes>
      <Route 
      exact path ="/"
      element= { token ? <Navigate to="/profile" /> : <Auth/>}
      />
      <Route 
      exact path ="/profile"
      element={<ProtectedRoute token={token} redirectTo ="/">
        <Profile />
      </ProtectedRoute>}
      />
      <Route 
      exact path ="/public"
      element={<Public/>}
      />
      
    </Routes>
    </div>
    )
    
  
}