import React from 'react'
import ReservationPage from './ReservationPage'
import Logout from './Logout'

function UserDashboard( {loggedIn}) {


  return (
    <>
    <Logout/>
    <ReservationPage/>
    </>
  )
}

export default UserDashboard