import React from 'react';
import useUser from '../../../hooks/useUser';
import { Link } from 'react-router-dom';

const FarmerHome = () => {
  const { currentUser } = useUser();

  const handleShareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My QR Code',
          text: `Check out my QR code!`,
          url: currentUser?.qrCodeUrl, // URL to share
        });
        console.log('QR code shared successfully');
      } catch (error) {
        console.error('Error sharing QR code:', error);
      }
    } else {
      alert('Sharing is not supported in your browser.');
    }
  };

  return (
    <div className='mt-5 flex justify-center items-center'>
      <div>
        <div>
          <h1 className='text-4xl capitalize font-bold'>
            Hi, <span className='text-secondary items-stretch'>{currentUser?.name}!</span> Welcome to your dashboard
          </h1>
          <img src={currentUser?.qrCodeUrl} alt="qr code" />

          <div className='text-center'>
            <h2 className='font-bold'>You can jump to any page you want from here.</h2>
            <div className='flex items-center justify-center my-4 gap-3 flex-wrap'>
              <div className='border border-secondary rounded-lg hover:bg-secondary hover:scale-110 duration-300 hover:text-white px-2 py-1'>
                <Link to='/dashboard/user-profile'>Your Profile</Link>
              </div>
              <div className='border border-secondary rounded-lg hover:bg-secondary hover:scale-110 duration-300 hover:text-white px-2 py-1'>
                <Link to='/dashboard/my-payments'>Payment History</Link>
              </div>
            </div>
          </div>

          {/* Share QR Code Button */}
          <div className='text-center my-4'>
            <button
              className='py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300'
              onClick={handleShareQRCode}
            >
              Share QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerHome;
