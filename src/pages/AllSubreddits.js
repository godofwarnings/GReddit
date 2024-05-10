import { Link, NavLink } from "react-router-dom";
import { BsFillPeopleFill } from "react-icons/bs";
import { useContext, useEffect, useState, Fragment } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Menu } from "@headlessui/react";
import Fuse from "fuse.js";
import { Combobox, Transition } from "@headlessui/react";
import {
   CheckIcon,
   ChevronUpDownIcon,
   ChevronDownIcon,
} from "@heroicons/react/20/solid";
import Scroll from "../components/Scroll";
import FilteredList from "../components/FilteredList";
import Searching from "./Searching";

const date_options = {
   year: "numeric",
   month: "long",
   day: "numeric",
   hour: "numeric",
   minute: "numeric",
};

const fetchSubs = async (token) => {
   const config = {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   };
   const response = await axios.get("/api/subreddit/all", config);
   const subs = response.data;
   return subs;
};

export function SingleSub({ sub, isMember }) {
   const { user } = useContext(AuthContext);

   const joinRequest = async () => {
      if (sub.left_users.includes(user.user.updatedUser._id)) {
         alert("You cannot join a subreddit once you've left it");
      } else if (sub.join_requests.includes(user.user.updatedUser._id)) {
         alert("You have already requested to join the subreddit");
      } else if (sub.followers.includes(user.user.updatedUser._id)) {
         const config = {
            headers: {
               Authorization: `Bearer ${user.user.token}`,
            },
         };
         try {
            const response = await axios.get(
               `/api/subreddit/g/leave/${sub.name}`,
               config
            );
            console.log(response.data);
            await fetchSubs(user.user.token);
         } catch (err) {
            console.log("ERROR");
            if (err.response) {
               console.log(err.response.data);
               console.log(err.response.status);
               console.log(err.response.headers);
            } else if (err.request) {
               console.log(err.request);
            } else {
               console.log("Error", err.message);
            }
         }
      } else {
         const config = {
            headers: {
               Authorization: `Bearer ${user.user.token}`,
            },
         };
         try {
            const response = await axios.get(
               `/api/subreddit/g/request/${sub.name}`,
               config
            );
            console.log(response.data);
            await fetchSubs(user.user.token);
         } catch (err) {
            console.log("ERROR");
            if (err.response) {
               console.log(err.response.data);
               console.log(err.response.status);
               console.log(err.response.headers);
            } else if (err.request) {
               console.log(err.request);
            } else {
               console.log("Error", err.message);
            }
         }
      }
   };
   return (
      <div className="flex flex-col">
         <div className="px-8 py-4 mb-3 rounded-lg bg-secondary shadow-md cursor:auto">
            <div className="flex flex-row">
               <div className="inline">
                  Created on{" "}
                  {new Date(sub.createdAt).toLocaleDateString("en-US", date_options)}
               </div>
            </div>
            <div className="mt-2">
               <div className="flex flex-row space-x-64 justify-between items-center">
                  <div className="flex flex-row space-x-2">
                     <div>
                        <NavLink to={`/g/${sub.name}`}>
                           <p className="text-4xl font-bold text-secondary-content hover:text-gray-600 dark:hover:text-gray-200 hover:underline">
                              g/{sub.name}
                           </p>
                        </NavLink>
                     </div>
                     <div className="flex flex-row justify-center items-center space-x-2">
                        <div>
                           <BsFillPeopleFill/>
                        </div>
                        <div>
                           {sub.followers_number <= 1 ? (
                              <>{sub.followers_number} Member</>
                           ) : (
                              <>{sub.followers_number} Members</>
                           )}
                        </div>
                     </div>
                  </div>
                  <div>
                     <div className="flex items-center">
                        {isMember === "member" ? (
                           <button
                              onClick={joinRequest}
                              className="bg-base-100 rounded-md text-primary hover:bg-white hover:text-base-100 w-[100px] h-[40px]"
                           >
                              Leave
                           </button>
                        ) : isMember === "moderator" ? (
                           <button
                              disabled
                              className="bg-base-100 rounded-md text-primary w-[100px] h-[40px]"
                           >
                              Moderator
                           </button>
                        ) : (
                           <button
                              onClick={joinRequest}
                              className="bg-white rounded-md text-base-100 hover:bg-base-100 hover:text-primary w-[100px] h-[40px]"
                           >
                              Join
                           </button>
                        )}
                     </div>
                  </div>
               </div>
               <div className="flex flex-col">
                  <div>
                     <p className="mt-2 text-info dark:base-300 text-md">
                        {sub.description}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

const AllSubreddits = () => {
   //* CONTEXTS
   const { user } = useContext(AuthContext);

   //* STATES
   const [allSubs, setAllSubs] = useState(null);
   const [newSubs, setNewSubs] = useState(null);
   const [joinedSubs, setJoinedSubs] = useState(null);
   const [modSubs, setModSubs] = useState(null);
   const [selected, setSelected] = useState("");
   const [query, setQuery] = useState("");
   const [selectedName, setSelectedName] = useState("");
   const [selectedFollowers, setSelectedFollowers] = useState("");
   const [selectedCreation, setSelectedCreation] = useState("");
   const [single, setSingle] = useState("");
   //* CONFIGS, CONSTANTS, OTHER DECLARATIONS
   const filteredsubreddits =
      query === ""
         ? allSubs
         : allSubs.filter((subreddit) =>
            subreddit.name
               .toLowerCase()
               .replace(/\s+/g, "")
               .includes(query.toLowerCase().replace(/\s+/g, ""))
         );
//   const fuse = new Fuse(allSubs, {
//     keys: ["name"],
//     includeScore: true
//    //  threshold: 
//   });
//   const fuzz_results = fuse.search(query);
//   console.log('Fuzzy search result', fuzz_results)

   //* FUNCTIONS
   function handleClick(event) {
      event.stopPropagation(); // prevent the default event
   }

   function handleChangeFollowers(event) {
      if (selectedFollowers === event.target.value) {
         setSelectedFollowers("");
      } else {
         setSelectedFollowers(event.target.value);
      }
      setSingle(event.target.value);
   }

   function handleChangeCreation(event) {
      if (selectedCreation === event.target.value) {
         setSelectedCreation("");
      } else {
         setSelectedCreation(event.target.value);
      }
      setSingle(event.target.value);
   }

   function handleChangeName(event) {
      if (selectedName === event.target.value) {
         setSelectedName("");
      } else {
         setSelectedName(event.target.value);
      }
      setSingle(event.target.value);
   }

   function dynamicSort(property) {
      //* Date: -Date descending, Date ascending
      //* name: name ascending, -name descending
      //* followers_number: followers_number ascending, -followers_number descending
      var sortOrder = 1;
      if (property[0] === "-") {
         sortOrder = -1;
         property = property.substr(1);
      }
      if (property === "Date") {
         return function (a, b) {
            return (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder;
         };
      } else if (property === "followers_number") {
         return function (a, b) {
            var result =
               a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            return result * sortOrder;
         };
      } else if (property === "name") {
         return function (a, b) {
            var result =
               a[property].toLowerCase() < b[property].toLowerCase()
                  ? -1
                  : a[property].toLowerCase() > b[property].toLowerCase()
                     ? 1
                     : 0;
            return result * sortOrder;
         };
      }
   }

   function searchList() {
      const result = filteredsubreddits.sort(dynamicSort(single));
      return (
         <Scroll>
            <FilteredList
               filteredSubs={result}
               userId={user.user.updatedUser._id}
            />
         </Scroll>
      );
   }

   //* useEFFECTS
   useEffect(() => {
      if (user.user) {
         fetchSubs(user.user.token).then((subs) => {
            const newS = [];
            const joinedS = [];
            const modS = [];
            const all = [];
            subs.forEach((sub) => {
               if (sub.creator === user.user.updatedUser._id) {
                  modS.push(sub);
                  all.push([sub, "moderator"]);
               } else if (sub.followers.includes(user.user.updatedUser._id)) {
                  joinedS.push(sub);
                  all.push([sub, "member"]);
               } else {
                  newS.push(sub);
                  all.push([sub, "new"]);
               }
            });
            setAllSubs(subs);
            setNewSubs(newS);
            setJoinedSubs(joinedS);
            setModSubs(modS);
            console.log(newS, joinedS, modS);
         });
      }
   }, []);

   return (
      (!allSubs ? (<Searching/>) : (<div className="flex flex-col h-full items-center bg-base-100">
         <div className="w-[50%] flex flex-col items-center bg-neutral-content mt-10 rounded-lg">
            <div className="flex flex-col w-full justify-start items-center mt-10">
               <div className="text-primary-content text-5xl">
                  <p>Search For Subreddits</p>
               </div>
               <div className="flex flex-row justify-around px-4 items-center h-full mb-28">
                  <div className="flex relative" onClick={handleClick}>
                     <Menu as="div">
                        <div>
                           <Menu.Button
                              className="flex w-60 justify-between rounded-md bg-primary-content bg-opacity-40 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                              Filter
                              <ChevronDownIcon
                                 className="ml-2 -mr-1 h-5 w-5 text-primary hover:text-primary-focus"
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
                              className="text-neutral-content w-60 absolute right-0 mt-2 max-h-32 overflow-scroll rounded-md bg-neutral shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="px-1 py-1">
                                 <Menu.Item className="block px-2 py-2">
                                    {({ active }) => (
                                       <label className={`${active && "bg-base-content"}`}>
                                          <input
                                             type="checkbox"
                                             name="Name"
                                             value="name"
                                             className="mx-2"
                                             onChange={handleChangeName}
                                             checked={selectedName === "name"}
                                          />
                                          Name (Ascending)
                                       </label>
                                    )}
                                 </Menu.Item>
                                 <Menu.Item className="block px-2 py-2">
                                    {({ active }) => (
                                       <label className={`${active && "bg-base-content"}`}>
                                          <input
                                             type="checkbox"
                                             name="Name"
                                             value="-name"
                                             className="mx-2"
                                             onChange={handleChangeName}
                                             checked={selectedName === "-name"}
                                          />
                                          Name (Descending)
                                       </label>
                                    )}
                                 </Menu.Item>
                                 <Menu.Item className="block px-2 py-2">
                                    {({ active }) => (
                                       <label className={`${active && "bg-base-content"}`}>
                                          <input
                                             type="checkbox"
                                             name="Followers"
                                             value="followers_number"
                                             className="mx-2"
                                             onChange={handleChangeFollowers}
                                             checked={selectedFollowers === "followers_number"}
                                          />
                                          Followers (Ascending)
                                       </label>
                                    )}
                                 </Menu.Item>
                                 <Menu.Item className="block px-2 py-2">
                                    {({ active }) => (
                                       <label className={`${active && "bg-base-content"}`}>
                                          <input
                                             type="checkbox"
                                             name="Followers"
                                             value="-followers_number"
                                             className="mx-2"
                                             onChange={handleChangeFollowers}
                                             checked={
                                                selectedFollowers === "-followers_number"
                                             }
                                          />
                                          Followers (Descending)
                                       </label>
                                    )}
                                 </Menu.Item>
                                 <Menu.Item className="block px-2 py-2">
                                    {({ active }) => (
                                       <label className={`${active && "bg-base-content"}`}>
                                          <input
                                             type="checkbox"
                                             name="CreationDate"
                                             value="Date"
                                             className="mx-2"
                                             onChange={handleChangeCreation}
                                             checked={selectedCreation === "Date"}
                                          />
                                          Creation (Ascending)
                                       </label>
                                    )}
                                 </Menu.Item>
                                 <Menu.Item className="block px-2 py-2">
                                    {({ active }) => (
                                       <label className={`${active && "bg-base-content"}`}>
                                          <input
                                             type="checkbox"
                                             name="CreationDate"
                                             value="-Date"
                                             className="mx-2"
                                             onChange={handleChangeCreation}
                                             checked={selectedCreation === "-Date"}
                                          />
                                          Creation (Descending)
                                       </label>
                                    )}
                                 </Menu.Item>
                              </div>
                           </Menu.Items>
                        </Transition>
                     </Menu>
                  </div>
                  <div className="w-full p-4">
                     {allSubs && (
                        <Combobox value={selected} onChange={setSelected}>
                           <div className="mt-1">
                              <div
                                 className="flex flex-row items-center justify-between w-[400px] bg-secondary cursor-default overflow-hidden rounded-lg text-left shadow-md sm:text-sm">
                                 <div>
                                    <Combobox.Input
                                       className="border-none py-2 pl-3 pr-10 w-[350px] text-sm text-secondary-content bg-secondary"
                                       displayValue={(subreddit) => subreddit.name}
                                       onChange={(event) => setQuery(event.target.value)}
                                    />
                                 </div>
                                 <div className="flex flex-row items-center justify-center px-3">
                                    <Combobox.Button className="">
                                       <ChevronUpDownIcon
                                          className="h-5 text-white"
                                          aria-hidden="true"
                                       />
                                    </Combobox.Button>
                                 </div>
                              </div>
                              <Transition
                                 as={Fragment}
                                 leave="transition ease-in duration-100"
                                 leaveFrom="opacity-100"
                                 leaveTo="opacity-0"
                                 afterLeave={() => setQuery("")}
                              >
                                 <Combobox.Options
                                    className="absolute mt-1 w-[400px] max-h-32 overflow-scroll rounded-md bg-neutral-content py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredsubreddits.length === 0 && query !== "" ? (
                                       <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                          No Subreddits found.
                                       </div>
                                    ) : (
                                       filteredsubreddits.map((subreddit) => (
                                          <Combobox.Option
                                             key={subreddit._id}
                                             className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                   active
                                                      ? "bg-teal-600 text-white"
                                                      : "text-gray-900"
                                                }`
                                             }
                                             value={subreddit.name}
                                          >
                                             {({ selected, active }) => (
                                                <>
                                  <span
                                     className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                     }`}
                                  >
                                    g/{subreddit.name}
                                  </span>
                                                </>
                                             )}
                                          </Combobox.Option>
                                       ))
                                    )}
                                 </Combobox.Options>
                              </Transition>
                           </div>
                        </Combobox>
                     )}
                  </div>
               </div>
            </div>
            {single === "" && query === "" ? (
               <div className="flex flex-col justify-start h-full w-full m-4 p-4">
                  {/* Moderating Subs */}
                  {modSubs &&
                     modSubs.map((sub) => (
                        <SingleSub key={sub._id} sub={sub} isMember={"moderator"}/>
                     ))}
                  {/* Joined Subs but not moderator */}
                  {joinedSubs &&
                     joinedSubs.map((sub) => (
                        <SingleSub key={sub._id} sub={sub} isMember={"member"}/>
                     ))}
                  {/* New Subs */}
                  {newSubs &&
                     newSubs.map((sub) => (
                        <SingleSub key={sub._id} sub={sub} isMember={"new"}/>
                     ))}
               </div>
            ) : (
               <div className="flex flex-col justify-start h-full w-full m-4 p-4">
                  {searchList()}
               </div>
            )}
         </div>
      </div>))
   );
};

export default AllSubreddits;
