import Tabs from "../components/Tabs/Tabs";
import Test from "./Test";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import Redirect from "./Redirect";
import Logout from "./Logout";
import Loading from "./Loading";

function classNames(...classes) {
   return classes.filter(Boolean).join(" ");
}

const ProfilePage = () => {
   const navigate = useNavigate()
   const { user, logout, initPosts, removeFollower, removeFollowing } = useContext(AuthContext);
   const [logStatus, setLogstatus] = useState(false)
   const handleLogout = async () => {
      try {
         await logout()
         console.log("Successfully logged out")
         setLogstatus(true)
         // navigate('/login')
      } catch (e) {
         console.error("Error during logout", e);
      }
   };
   const rFollower = async (id) => {
      await removeFollower(id)
      console.log("Removed follower")
   }
   const rFollowing = async (id) => {
      await removeFollowing(id)
      console.log("Removed following")
   }
   useEffect(() => {
      if (!user.isLoading) {
         console.log("islOading is false");
         if (!user.user) {
            console.log("user not exist", user.user);
            navigate('/login')
         } else {
            console.log("User", user)
            initPosts().then(() => console.log("finished"));
         }
      }
   }, []);
   return (
      (logStatus ? <Logout/> : user.isLoading ? (<Loading/>) : !user.user ? (<Redirect/>) : (<div className="bg-gray-300">
         {/* User Info */}
         <div className="pt-10 px-64 min-h-[350px] bg-accent text-secondary-content">
            <div className="flex space-x-1">
               <div
                  className="flex mask mask-hexagon-2 w-52 items-center justify-center p-1 mr-7 bg-gradient-to-tr from-primary to-secondary-content">
                  <img
                     className="mask mask-hexagon-2 w-64 border-white"
                     src={process.env.PUBLIC_URL + "/images/image_3.jpg"}
                     alt=""
                  />
               </div>

               <div>
                  <div className="flex items-center justify-between">
                     <div className="flex space-x-6">
                <span className="font-semibold text-2xl mr-[20px]">
                  {user.isLoading ? (
                     <p>...</p>
                  ) : user.error ? (
                     <p>{user.error}</p>
                  ) : (
                     user.user.updatedUser.username
                  )}
                </span>
                        <span className="border border-orange-700 p-1 px-3 mx-7">
                  Edit Profile
                </span>
                        <span className="border bg-black text-blue-50 border-orange-700 p-1 px-3 mx-7">
                  <button onClick={handleLogout}>Logout</button>
                </span>
                        <div className="flex items-center justify-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                           </svg>
                        </div>
                     </div>
                  </div>
                  <div className="flex space-x-6 pt-3">
              <span className="text-md font-bold">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                       className="inline-flex w-56 justify-between rounded-md border border-primary-focus bg-primary px-4 py-2 text-sm font-medium text-base-100 shadow-sm hover:bg-secondary-content focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-accent-focus">
                      Followers{" : "}
                       {user.isLoading ? (
                          <p>...</p>
                       ) : user.error ? (
                          <p>{user.error}</p>
                       ) : (
                          user.user.updatedUser.followers_number
                       )}
                       <ChevronDownIcon
                          className="-mr-1 ml-2 h-5 w-5"
                          aria-hidden="true"
                       />
                    </Menu.Button>
                  </div>
                  <Transition
                     as={Fragment}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                       className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-neutral-content shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {user.isLoading ? (
                           <p>...</p>
                        ) : user.error ? (
                           <p>{user.error}</p>
                        ) : user.user.updatedUser.followers_number > 0 ? (
                           user.user.updatedUser.followers.map((follower) => (
                              <Menu.Item key={follower._id}>
                                 {({ active }) => (
                                    <div className="block px-4 py-2 text-sm text-base-100">
                                       <div className="flex flex-row justify-between items-center">
                                          <p>{follower.username}</p>
                                          <button
                                             className={classNames(
                                                active ? "bg-warning" : "",
                                                "px-4 py-2 text-sm rounded-md"
                                             )
                                             }
                                             onClick={() => rFollower(follower._id)}
                                          >
                                             remove
                                          </button>
                                       </div>
                                    </div>
                                 )}
                              </Menu.Item>
                           ))
                        ) : (
                           <Menu.Item>
                              {({ active }) => (
                                 <p className="text-base-100 text-sm p-2">
                                    No followers
                                 </p>
                              )}
                           </Menu.Item>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </span>
                     <span className="text-md font-bold">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                       className="inline-flex w-56 justify-between rounded-md border border-primary-focus bg-primary px-4 py-2 text-sm font-medium text-base-100 shadow-sm hover:bg-secondary-content focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-accent-focus">
                      Following{" : "}
                       {user.isLoading ? (
                          <p>...</p>
                       ) : user.error ? (
                          <p>{user.error}</p>
                       ) : (
                          user.user.updatedUser.following_number
                       )}
                       <ChevronDownIcon
                          className="-mr-1 ml-2 h-5 w-5"
                          aria-hidden="true"
                       />
                    </Menu.Button>
                  </div>
                  <Transition
                     as={Fragment}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                       className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-neutral-content shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {user.isLoading ? (
                           <p>...</p>
                        ) : user.error ? (
                           <p>{user.error}</p>
                        ) : user.user.updatedUser.following_number > 0 ? (
                           user.user.updatedUser.following.map((following) => (
                              <Menu.Item key={following._id}>
                                 {({ active }) => (
                                    <div className="block px-4 py-2 text-sm text-base-100">
                                       <div className="flex flex-row justify-between items-center">
                                          <p>{following.username}</p>
                                          <button
                                             onClick={() => rFollowing(following._id)}
                                             className={classNames(
                                                active ? "bg-warning" : "",
                                                "px-4 py-2 text-sm rounded-md"
                                             )}
                                          >
                                             unfollow
                                          </button>
                                       </div>
                                    </div>
                                 )}
                              </Menu.Item>
                           ))
                        ) : (
                           <Menu.Item>
                              {({ active }) => (
                                 <p className="text-base-100 text-sm p-2">
                                    Not following anyone
                                 </p>
                              )}
                           </Menu.Item>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </span>
                  </div>
                  <div className="pt-5 grid w-96">
                     <span className="text-lg font-semibold">About</span>
                     <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                officia adipisci officiis cum commodi doloremque. Adipisci nulla
                voluptatem ducimus autem velit fuga et exercitationem, eum esse
                rerum blanditiis explicabo quia.
              </span>
                  </div>
               </div>
            </div>
         </div>
         <Tabs/>
      </div>))
   );
};

<dispatchEvent className="class"></dispatchEvent>;

export default ProfilePage;
