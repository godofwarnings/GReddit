import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const About = () => {
   const { user } = useContext(AuthContext)
   return (
      <div>
         <div className="pt-10 pl-10 space-y-7 flex flex-col justify-left h-[700px] bg-base-100 text-zinc-50">
            <div className="flex flex-col">
               <span className="font-bold text-2xl">First Name</span>
               <span className="font-xs text-gray-400">
            {
               user.isLoading ? (
                  <p>Loading...</p>
               ) : user.error ? (
                  <p>{user.error}</p>
               ) : (
                  user.user.updatedUser.fname
               )
            }

          </span>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-2xl">Last Name</span>
               <span className="font-xs text-gray-400">
                  {
                     user.isLoading ? (
                        <p>Loading...</p>
                     ) : user.error ? (
                        <p>{user.error}</p>
                     ) : (
                        user.user.updatedUser.lname
                     )
                  }

          </span>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-2xl">user.username</span>
               <span className="font-xs text-gray-400">
                  {
                     user.isLoading ? (
                        <p>Loading...</p>
                     ) : user.error ? (
                        <p>{user.error}</p>
                     ) : (
                        user.user.updatedUser.username
                     )
                  }
          </span>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-2xl">Email address</span>
               <span className="font-xs text-gray-400">
                  {
                     user.isLoading ? (
                        <p>Loading...</p>
                     ) : user.error ? (
                        <p>{user.error}</p>
                     ) : (
                        user.user.updatedUser.emailID
                     )
                  }
          </span>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-2xl">Age</span>
               <span className="font-xs text-gray-400">
                  {
                     user.isLoading ? (
                        <p>Loading...</p>
                     ) : user.error ? (
                        <p>{user.error}</p>
                     ) : (
                        user.user.updatedUser.age
                     )
                  }
               </span>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-2xl">Contact</span>
               <span className="font-xs text-gray-400">12122121</span>
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-2xl">Password</span>
               <span className="font-xs text-gray-400">
            user.user.updatedUser.password
          </span>
            </div>
         </div>
      </div>
   );
};

export default About;
