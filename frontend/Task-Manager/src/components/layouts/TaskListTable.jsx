import React from 'react'
import moment from 'moment'

const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border border-green-200'
      case 'Pending': return 'bg-purple-100 text-purple-700 border border-purple-200'
      case 'In Progress': return 'bg-cyan-100 text-cyan-700 border border-cyan-200'
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border border-red-200'
      case 'Medium': return 'bg-orange-100 text-orange-700 border border-orange-200'
      case 'Low': return 'bg-green-100 text-green-700 border border-green-200'
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }
  console.log(tableData)

  return (
    <div className='overflow-x-auto rounded-lg mt-4 shadow'>
      <table className='min-w-full bg-white rounded-lg'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='py-3 px-6 text-left text-[13px] font-semibold text-gray-600'>Name</th>
            <th className='py-3 px-6 text-left text-[13px] font-semibold text-gray-600'>Status</th>
            <th className='py-3 px-6 text-left text-[13px] font-semibold text-gray-600'>Priority</th>
            <th className='py-3 px-6 text-left text-[13px] font-semibold text-gray-600 hidden md:table-cell'>Created On</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.length > 0 ? (
            tableData.map((task) => (
              <tr key={task._id} className='border-t hover:bg-gray-50 transition-colors'>
                <td className='py-4 px-6 text-[13px] text-gray-700 max-w-xs truncate'>
                  {task.title}
                </td>
                <td className='py-4 px-6'>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className='py-4 px-6'>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className='py-4 px-6 text-[13px] text-gray-600 hidden md:table-cell whitespace-nowrap'>
                  {task.createdAt ? moment(task.createdAt).format('DD MMM YYYY') : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className='text-center py-6 text-gray-500 text-sm'>
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TaskListTable
