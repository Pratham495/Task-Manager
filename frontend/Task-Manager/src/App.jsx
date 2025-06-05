import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
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


function App() {
  return (
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


        </Routes>
      </Router>
    </div>
  )
}

export default App