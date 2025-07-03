import React, { useContext } from 'react'
import { BrowserRouter as Router,Routes,Route, Outlet, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import PrivateRoute from './routes/PrivateRoute'
import Dashboard from './pages/Admin/Dashboard'
import ManageTask from './pages/Admin/ManageTask'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/User/UserDashboard'
import MyTask from './pages/User/MyTask'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import UserProvider from './context/UserContext'


function App() {
  return (
    <UserProvider>
 <div >
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signUp' element={<Signup/>}/>

          {/* Admin Routes*/}

          <Route element={<PrivateRoute allowedRoles={('admin')}/>}>
          <Route path='/admin/dashboard' element={<Dashboard/>}/>
           <Route path='/admin/tasks' element={<ManageTask/>}/>
            <Route path='/admin/create-task' element={<CreateTask/>}/>
             <Route path='/admin/users' element={<ManageUsers/>}/>
          </Route>

            {/* User Routes*/}

          <Route element={<PrivateRoute allowedRoles={('user')}/>}>
          <Route path='/user/dashboard' element={<UserDashboard/>}/>
          <Route path='/user/my-tasks' element={<MyTask/>}/>
          <Route path='/user/tasks-details/:id' element={<ViewTaskDetails/>}/>
          </Route>

             {/* Default Route*/}
              <Route path='/' element={<Root/>}/>
        </Routes>
      </Router>
    </div>
    </UserProvider>
   
  )
}

export default App

const Root = () => {
  const {user , loading } = useContext(userContext);

  if(loading) return <Outlet/>

  if(!user)
  {
    return <Navigate to="/login"/>
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard"/>
  : <Navigate to="/user/dashboard"/>
}