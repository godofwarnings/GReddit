import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useContext, useState } from 'react'
import { AuthContext } from "../context/AuthContext";

export default function ModalReport({ isVisible, onClose, post_id }) {
   const [concern, setConcern] = useState("")
   const { createReport } = useContext(AuthContext)

   const handleReport = (event) => {
      setConcern(event.target.value)
   }
   const handleSubmit = async (event) => {
      event.preventDefault();
      await createReport(post_id, concern)
      console.log(concern)
   }
   return (
      <>
         <Transition appear show={isVisible} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25"/>
               </Transition.Child>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        <Dialog.Panel
                           className="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary-content p-6 text-left align-middle shadow-xl transition-all">
                           <Dialog.Title
                              as="h3"
                              className="text-2xl font-medium leading-6 text-secondary-content"
                           >
                              Report Concern
                           </Dialog.Title>
                           <div className="mt-2">
                              <p className="text-sm text-secondary-content">
                                 Please don't falsely report a user. Don't be a bitch.
                              </p>
                              <form className="py-6 px-2 rounded-t-md"
                                    onSubmit={(e) => handleSubmit(e)}>
                                 <div className="items-center py-2 px-4 mb-4 rounded-lg rounded-t-lg border
                         border-gray-200 bg-accent-content">
                     <textarea onChange={(e) => handleReport(e)} id="report" rows="6"
                               className="px-0 w-full text-sm text-primary-content border-0 focus:ring-0 focus:outline-none bg-accent-content"
                               placeholder="Write your concern..."
                               value={concern}
                               required/>
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <button type="submit" onClick={onClose}
                                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium
                        text-center text-secondary-content rounded-lg focus:ring-4
                         bg-accent hover:bg-accent-content hover:text-primary-content"
                                    >
                                       Report Concern
                                    </button>
                                 </div>
                              </form>
                           </div>

                           <div className="mt-4">
                              <button
                                 type="button"
                                 className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                 onClick={onClose}
                              >
                                 Got it, thanks!
                              </button>
                           </div>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   )
}
