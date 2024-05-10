import React, { useEffect, useRef, useState } from 'react';
import lottie from "lottie-web";
import { useNavigate } from 'react-router-dom';
import { useTimeout } from "@chakra-ui/react";

const Redirect = ({ path_ }) => {
   const navigate = useNavigate();
   const [delayElapsed, setDelayElapsed] = useState(false);
   const container = useRef(null)
   const navigateToLogin = () => {
      if (path_) {
         navigate('/profile');
      } else {
         navigate('/login');
      }
   };
   setTimeout(() => {
      navigateToLogin();
      setDelayElapsed(true);
   }, 1500);
   if (delayElapsed) {
      if (path_) {
         navigate('/profile');
      } else {
         navigate('/login');
      }
   }
   useEffect(() => {
      const instance = lottie.loadAnimation({
         container: container.current,
         renderer: 'svg',
         loop: true,
         autoplay: true,
         animationData: require('../lotties/Redirect.json'),
         preserveAspectRatio: 'xMidYMid meet'
      })
      // Return clean up function here
      return () => instance.destroy();
   }, [])
   return (
      <div className='flex flex-col align-center justify-start h-[1080px] bg-base-100 shadow-2xl pt-5'>
         <div className="text-3xl text-info h-max text-center">Redirecting....</div>
         <div ref={container} className='h-[350px]'>
         </div>
      </div>
   );
};

export default Redirect;
