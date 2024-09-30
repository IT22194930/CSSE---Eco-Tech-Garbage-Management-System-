import React from 'react'
import useUser from '../../../hooks/useUser'
import { Link } from 'react-router-dom';

const FarmerHome = () => {
   const {currentUser} = useUser();
  return (
    <div className='mt-5 flex justify-center items-center'>
      <div>
         <div>
            <h1 className='text-4xl capitalize font-bold'>Hi, <span className='text-secondary items-stretch'>{currentUser?.name}!</span> Welcome to your dashboard </h1>

            <div className='text-center'>
               <h2 className='font-bold'>You can jump any page you want from here .</h2>
               <div className='flex items-center justify-center my-4 gap-3 flex-wrap'>
                  <div className='border border-secondary rounded-lg hover:bg-secondary hover:scale-110 duration-300 hover:text-white px-2 py-1'>
                     <Link to='/dashboard/user-profile'>Your Profile</Link>
                  </div>
                  <div className='border border-secondary rounded-lg hover:bg-secondary hover:scale-110 duration-300 hover:text-white px-2 py-1'>
                     <Link to='/dashboard/my-payments'>Payment History</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default FarmerHome