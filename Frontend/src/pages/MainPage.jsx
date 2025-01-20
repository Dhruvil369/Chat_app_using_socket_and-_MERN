// import React from 'react'
import AuthImagePattern from '../Component/AuthImagePattern'
// import { Link } from 'react-router-dom'


export default function MainPage() {
  return (
    <div className='mt-16'>
       
      <AuthImagePattern 
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />

    </div>
  )
}
