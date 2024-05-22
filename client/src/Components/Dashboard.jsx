import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export const Dashboard = () => {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() =>{
        axios.get('http://localhost:3000/auth/verify')
        .then(res=>{
            if(res.data.status){
               
            }else{
                navigate('/')
            }
            console.log(res)
        })
    },[])
  return (
    <div className="text-3xl font-bold underline" >Dashboard</div>
  )
}

export default Dashboard