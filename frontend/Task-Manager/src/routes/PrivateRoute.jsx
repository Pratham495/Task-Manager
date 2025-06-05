import React from 'react'

function PrivateRoute({allowedRoles}) {
  return <Outlet/>
}

export default PrivateRoute