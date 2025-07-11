import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='flex items-center p-3 bg-white rounded-2xl shadow hover:shadow-md transition-shadow duration-300'>
      <div className={`w-3 h-3 ${color} rounded-full mr-3`}></div>
      <div>
        <p className='text-[13px] text-gray-500'>{label}</p>
        <p className='text-lg font-semibold text-black'>{value}</p>
      </div>
    </div>
  )
}

export default InfoCard
