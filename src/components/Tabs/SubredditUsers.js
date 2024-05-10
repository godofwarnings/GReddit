import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SubredditUsers = ({ subreddit }) => {
   return (
      <div className="flex flex-col items-start justify-start">
         <div className="flex flex-row px-4 w-full items-start">
            <div className="mx-auto w-[61%] rounded-2xl bg-neutral-content p-2">
               <Disclosure>
                  {({ open }) => (
                     <>
                        <Disclosure.Button
                           className="flex w-full justify-between rounded-lg bg-accent px-4 py-2 text-left text-sm font-medium text-secondary-content hover:text-neutral hover:bg-accent-content focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                           <span>Followers</span>
                           <ChevronUpIcon
                              className={`${
                                 open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-purple-500`}
                           />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                           {subreddit.followers.length > 0 &&
                              subreddit.followers.map((follower) =>  <div key={follower._id}
                                                                          className="flex flex-col items-start bg-secondary text-neutral-content py-4 rounded-md px-4 my-2 text-lg">
                                 <p
                                    className="my-1 text-4xl">{follower.username}</p><p
                                 className="my-1 text-base-content mb-2">{follower.emailID}</p>
                              </div>)
                           }
                        </Disclosure.Panel>
                     </>
                  )}
               </Disclosure>
               <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                     <>
                        <Disclosure.Button
                           className="flex w-full justify-between rounded-lg bg-accent px-4 py-2 text-left text-sm font-medium text-secondary-content hover:text-neutral hover:bg-accent-content focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                           <span>Blocked Users</span>
                           <ChevronUpIcon
                              className={`${
                                 open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-purple-500`}
                           />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                           {subreddit.blocked_users.length > 0 ?
                              subreddit.blocked_users.map((blocked) => <div key={blocked._id}
                                                                            className="flex flex-col items-start bg-secondary text-neutral-content py-4 rounded-md px-4 my-2 text-lg">
                                 <p
                                    className="my-1 text-4xl">{blocked.username}</p><p
                                 className="my-1 text-base-content mb-2">{blocked.emailID}</p>
                              </div>)
                              : (<p> No blockes users </p>)
                           }
                        </Disclosure.Panel>
                     </>
                  )}
               </Disclosure>
            </div>
         </div>
      </div>
   );
};

export default SubredditUsers;
