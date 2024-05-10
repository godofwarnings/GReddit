import Button from "./Button";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = ({ text, iconClass, setStatus }) => {
      const navigate = useNavigate()
      const { login, user, initPosts } = useContext(AuthContext);
      const [emailID, setEmailID] = useState(null);
      const [password, setPassword] = useState(null);
      const handleSubmit = async (e) => {
         e.preventDefault();
         login(emailID, password).then(() => {
            console.log("ready to navigate")
            setStatus(true)
         });
      };
      useEffect(() => {
      }, [])


      return (
         <div className="flex align-center justify-center bg-primary p-4 pt-1 rounded-lg shadow-2xl text-primary-content">
            <div className="flex flex-col">
               <div className="text-center mt-2">
          <span className="rounded-full">
            <div className="bg-primary space-y-2">
              <h1 className="text-5xl font-bold">Login</h1>
              <p className="mt-10 bg-primary-focus p-3">
                Enter your email address and password to login
              </p>
            </div>
          </span>
               </div>
               <div>
                  <form onSubmit={handleSubmit} method="POST">
                     <div className="grid grid-rows-2 space-y-0">
                        <div className="form-group mt-5">
                           <label className=" text-2xl">
                              Email ID
                              <input
                                 className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md 
                    transition ease-in-out m-0 
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                                 name="emailID"
                                 onChange={(e) => setEmailID(e.target.value)}
                                 type="email"
                                 placeholder="emailID"
                                 required
                              />
                           </label>
                        </div>
                        <div className="form-group">
                           <label className=" text-2xl mb-0">
                              Password
                              <input
                                 className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md 
                    transition ease-in-out m-0 
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                                 name="password"
                                 onChange={(e) => setPassword(e.target.value)}
                                 type="password"
                                 placeholder="password"
                                 required
                              />
                           </label>
                        </div>
                     </div>
                     <div className="mb-5">
                        <Button
                           id="#login"
                           children={text}
                           iconClass={iconClass}
                           type="submit"
                           // isDisabled={user.isLoading}
                        />
                     </div>
                  </form>
                  <div className="flex justify-center">
                     <button
                        type="button"
                        className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                     >
                        <svg
                           className="w-4 h-4 mr-2 -ml-1"
                           aria-hidden="true"
                           focusable="false"
                           data-prefix="fab"
                           data-icon="facebook-f"
                           role="img"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 320 512"
                        >
                           <path
                              fill="currentColor"
                              d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
                           ></path>
                        </svg>
                        Sign in with Facebook
                     </button>
                     <button
                        type="button"
                        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
                     >
                        <svg
                           className="w-4 h-4 mr-2 -ml-1"
                           aria-hidden="true"
                           focusable="false"
                           data-prefix="fab"
                           data-icon="google"
                           role="img"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 488 512"
                        >
                           <path
                              fill="currentColor"
                              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                           ></path>
                        </svg>
                        Sign in with Google
                     </button>
                  </div>
                  <span className="mt-0 text-2xl text-error-content">{user && <div>{user.error}</div>}</span>
               </div>
            </div>
         </div>
      );
   }
;

export default Login;
