import React, { useEffect, useRef } from 'react';
import lottie from "lottie-web";

const Searching = () => {
   const container = useRef(null)
   useEffect(() => {
      const instance = lottie.loadAnimation({
         container: container.current,
         renderer: 'svg',
         loop: true,
         autoplay: true,
         animationData: require('../lotties/Searching.json'),
         preserveAspectRatio: 'xMidYMid meet'
      })
      // Return clean up function here
      return () => instance.destroy();
   }, [])
   return (
      <div className='flex flex-col align-center justify-start h-[1080px] bg-base-100 shadow-2xl pt-5'>
         <div className="text-3xl text-info h-max text-center">Searching</div>
         <div ref={container} className='h-[350px]'>
         </div>
      </div>
   );
};

export default Searching;
