import React from 'react'
import { useSelector } from 'react-redux'

export default function TeamsDashboard() {
  const {user} = useSelector((state)=> state.profile)
  return (
    <>
       
            <div className="flex justify-center items-center p-4 mt-6">
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
    <p className="text-lg font-semibold text-richblack-700">Name: <span className="font-normal">{user.name}</span></p>
    <p className="text-lg font-semibold text-richblack-700 mt-2">User Id: <span className="font-normal">{user.user_id}</span></p>
    <p className="text-lg font-semibold text-richblack-700 mt-2">Mobile No: <span className="font-normal">{user.personal_number}</span></p>
    <p className="text-lg font-semibold text-richblack-700 mt-2">CK No: <span className="font-normal">{user.ck_number}</span></p>
  </div>
</div>
    </>
  )
}
