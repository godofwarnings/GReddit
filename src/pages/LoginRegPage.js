import { useContext, useEffect, useRef, useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import { AuthContext } from "../context/AuthContext";
import animationData from '../lotties/success_data';
import lottie from 'lottie-web';
import { useNavigate } from "react-router-dom";
import Redirect from "./Redirect";
import Loading from "./Loading";
import RegisterSuccess from "./RegisterSuccess";
import Loggedin from "./Loggedin";

const LoginRegPage = () => {
   const navigate = useNavigate()
   const [loginSuccess, setLoginSuccess] = useState(false)
   const [registerStatus, setRegisterStatus] = useState(false)
   const { user, isLoading } = useContext(AuthContext)
   const [page, setPage] = useState(true);
   const container = useRef(null)
   const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
         preserveAspectRatio: "xMidYMid slice"
      }
   };
   useEffect(() => {
      if (!user.isLoading) {
         console.log("islOading is false");
         if (user.user) {
            console.log("user exists", user.user);
            // navigate('/profile')
         }
      }
      const instance = lottie.loadAnimation({
         container: container.current,
         renderer: 'svg',
         loop: false,
         autoplay: true,
         animationData: require('../lotties/success_data.json'),
         preserveAspectRatio: 'xMidYMid meet'
      })
      // Return clean up function here
      return () => instance.destroy();
   }, [])

   function LoginForm() {
      return <Login text="Login" iconClass="btn login" setStatus={setLoginSuccess}/>;
   }

   function RegisterForm() {
      return <Register text="Register" iconClass="btn register" setStatus={setRegisterStatus}/>;
   }

   if (isLoading) {
      return (
         <div><Loading/></div>
      )
   }

   return (
      (registerStatus ? (<RegisterSuccess setStatus={registerStatus} />) : loginSuccess ? (<Loggedin setStatus={setLoginSuccess} />) : user.user ? (
               <Redirect path_={'/profile'}/>) :
            <div className="flex flex-column align-center justify-center h-[1080px] bg-base-100 shadow-2xl">
               <div className="w-[500px] pt-[150px]">
                  <div className="grid grid-cols-2 gap-1">
                     <button
                        onClick={() => setPage(true)}
                        className="inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-primary-focus to-secondary group-hover:from-primary-focus group-hover:to-secondary hover:text-secondary-content dark:text-primary focus:ring-2 focus:outline-none focus:ring-pink-200 dark:focus:ring-primary-focus"
                     >
                        <div
                           className="text-xl align-middle w-full py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                           Login
                        </div>
                     </button>
                     <button
                        onClick={() => setPage(false)}
                        className="inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-secondary to-primary-focus group-hover:from-primary-focus group-hover:to-secondary hover:text-secondary-content dark:text-primary focus:ring-2 focus:outline-none focus:ring-pink-200 dark:focus:ring-primary-focus"
                     >
            <span
               className="text-xl align-middle w-full py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Register
            </span>
                     </button>
                  </div>
                  <div>{page ? LoginForm() : RegisterForm()}</div>
               </div>
            </div>
      )

   )
      ;
};

export default LoginRegPage;
