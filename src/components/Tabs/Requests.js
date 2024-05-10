import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const Requests = ({ subreddit }) => {
   console.log(subreddit.join_requests)
   const { requestAction } = useContext(AuthContext)
   const handleRequest = async (action, req_id) => {
      await requestAction(action, req_id, subreddit.name)
   }
   return (
      <div>
         <div className="mx-auto w-[60%] rounded-2xl bg-neutral-content p-2">
            <Disclosure>
               {({ open }) => (
                  <>
                     <Disclosure.Button
                        className="flex w-full justify-between rounded-lg bg-accent px-4 py-2 text-left text-sm font-medium text-secondary-content hover:text-neutral hover:bg-accent-content focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <span>Join Requests</span>
                        <ChevronUpIcon
                           className={`${
                              open ? 'rotate-180 transform' : ''
                           } h-5 w-5 text-purple-500`}
                        />
                     </Disclosure.Button>
                     <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        {subreddit.join_requests.length > 0 ?
                           subreddit.join_requests.map((request) => <div key={request._id}
                                                                         className="flex flex-col items-start bg-secondary text-neutral-content py-4 rounded-md px-4 my-2 text-lg">
                              <p
                                 className="my-1 text-4xl">{request.username}</p><p
                              className="my-1 text-base-content mb-2">{request.emailID}</p>
                              <div className="flex flex-row space-x-2">
                                 <button onClick={() => handleRequest("accept",request._id)} className="bg-primary p-2 rounded-md text-error-content hover:bg-primary-content hover:text-secondary-content"> Accept</button>
                                 <button onClick={() => handleRequest("reject",request._id)} className="bg-primary p-2 rounded-md text-error-content hover:bg-primary-content hover:text-secondary-content"> Reject</button>
                              </div>
                           </div>) :
                           (<p>No join requests</p>)
                        }
                     </Disclosure.Panel>
                  </>
               )}
            </Disclosure>
         </div>
      </div>
   );
};

export default Requests;
