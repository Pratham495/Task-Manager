import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/layouts/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ['#8D51FF', '#00B8DB', '#7BCE00']; 

const Dashboard = () => {
  useUserAuth();

  const {user} =  useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;
    
    const taskDistributionData = [
      {status: "Pending", count: taskDistribution?.Pending || 0},
      {status: "In Progress", count: taskDistribution?.InProgress || 0},
      {status: "Completed", count: taskDistribution?.Completed || 0},
    ]
    setPieChartData(taskDistributionData);
    
    const PriorityLevelData = [
      {status: "Low", count: taskPriorityLevels?.Low || 0},
      {status: "Medium", count: taskPriorityLevels?.Medium || 0},
      {status: "High", count: taskPriorityLevels?.High || 0},
    ];
    
    setBarChartData(PriorityLevelData);
    
  }
  
  const getDashboardData = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if(response.data)
        {
          setDashboardData(response.data);
          prepareChartData(response.data?.charts || null)
        }
      }
      catch (error)
      {
        console.error('Error Fetching Users: ',error)
      }
    }
    
    useEffect(()=>{
      getDashboardData();
      return () => {};
    },[])
    
    const onSeeMore = () => {
      navigate('/admin/tasks')
    }
    
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };
    const [greeting, setGreeting] =  useState(getGreeting());
  console.log(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000); // check every 1 minute

    return () => clearInterval(interval);
  }, []);
  console.log(greeting)

  return (
<DashboardLayout activeMenu="Dashboard">
  <div className="my-8 space-y-8">

    {/* Greeting Section */}
    <div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        {greeting}, {user?.name}
      </h2>
      <p className="text-sm md:text-base text-gray-500 mt-1">
        {moment().format("dddd, Do MMM YYYY")}
      </p>
    </div>

    {/* Info Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <InfoCard
        label="Total Tasks"
        value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
        color="bg-primary"
      />
      <InfoCard
        label="Pending"
        value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
        color="bg-violet-500"
      />
      <InfoCard
        label="In Progress"
        value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
        color="bg-cyan-500"
      />
      <InfoCard
        label="Completed"
        value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
        color="bg-lime-500"
      />
    </div>

    {/* Charts & Table Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-semibold">Task Distribution</h5>
        </div>
        <CustomPieChart
          data={pieChartData}
          label="Total Balance"
          color={COLORS}
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between ">
          <h5 className="text-lg font-semibold">Task Priority Levels</h5>
        </div>
        <CustomBarChart
          data={barChartData}
          
        />
      </div>

      {/* Recent Tasks Table (spans 2 cols on larger screens) */}
      <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-lg font-semibold">Recent Tasks</h5>
          <button
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
            onClick={onSeeMore}
          >
            See All <LuArrowRight className="ml-1 text-base" />
          </button>
        </div>
        <TaskListTable tableData={dashboardData?.recentTask || []} />
      </div>
    </div>
  </div>
</DashboardLayout>


  )
}

export default Dashboard