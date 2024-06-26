import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Home from './Components/Home'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetPassword'
import Dashboard from './Components/Dashboard'
import VerifyEmail from './Components/VerifyEmail'
import Profile from './Components/Profile'
import Info from './Components/Info'
import Logs from './Components/Logs'
import Bar_management from './Components/Bar_management'
import BarDetail from './Components/BarDetail'


function App() {

  


  return (
    <>
     <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"></link>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path="/signup" element={<Signup />} ></Route>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />} ></Route>
        <Route path="/resetPassword/:token" element={<ResetPassword />} ></Route>
        <Route path="/dashboard" element={<Dashboard />} ></Route>
        <Route path="/verifyEmail/:token" element={<VerifyEmail/>} ></Route>
        <Route path="/profil" element={<Profile/>} ></Route>
        <Route path="/info" element={<Info/>} ></Route>
        <Route path="/logs" element={<Logs/>}></Route>
        <Route path='/bar_manage' element={<Bar_management/>}></Route>
        <Route path='/bar/:barId/' element={<BarDetail/>}></Route>
        </Routes>
    </BrowserRouter>


    </>
  )
}

export default App
