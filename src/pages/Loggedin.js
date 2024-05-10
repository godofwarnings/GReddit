import React, { useEffect, useRef, useState } from 'react';
import lottie from "lottie-web";
import { useNavigate } from 'react-router-dom';

const Loggedin = ({ setStatus }) => {
   const navigate = useNavigate();
   const [delayElapsed, setDelayElapsed] = useState(false);
   const container = useRef(null)
   const navigateToLogin = () => {
      setStatus(false)
      navigate('/profile');
   };
   setTimeout(() => {
      navigateToLogin();
      setDelayElapsed(true);
   }, 2000);
   if (delayElapsed) {
      setStatus(false)
      navigate('/profile')
   }
   useEffect(() => {
      const instance = lottie.loadAnimation({
         container: container.current,
         renderer: 'svg',
         loop: true,
         autoplay: true,
         animationData: require('../lotties/success_data.json'),
         preserveAspectRatio: 'xMidYMid meet'
      })
      // Return clean up function here
      return () => instance.destroy();
   }, [])
   return (
      <div className='flex flex-col align-center justify-start h-[1080px] bg-base-100 shadow-2xl pt-5'>
         <div className="text-3xl text-success h-max text-center">Succesfully logged in</div>
         <div ref={container} className='h-[350px]'>
         </div>
      </div>
   );
};

export default Loggedin;
