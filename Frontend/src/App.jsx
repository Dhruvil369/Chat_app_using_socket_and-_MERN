import Navbar from "./Component/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Signuppage from "./pages/Signuppage";
import ProfilePage from "./pages/ProfilePage";
import SeetingPage from "./pages/SeetingPage";
import MainPage from "./pages/MainPage";

import { Routes, Route,Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"


export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(()=> {
    checkAuth();
  },[checkAuth]);

  console.log({authUser}) 
  

  if(isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    );

return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/home" element={ <HomePage /> } />
        {/* <Route path="/signup" element={ <Signuppage />} /> */}
        <Route path="/signup" element={!authUser ? <Signuppage /> : <Navigate to="/home"/>} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/login" element={!authUser ? <LoginPage />  : <Navigate to="//"/>} /> */}
        <Route path="/setting" element={<SeetingPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes>
      <Toaster/>
    </div>
  );
}
