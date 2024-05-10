import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Scroll from "./Scroll";
import FilteredList from "./FilteredList";
// const subreddits = [
//   { _id: 1, name: "Posts" },
//   { _id: 2, name: "Askreddit" },
//   { _id: 3, name: "Astronomy" },
//   { _id: 4, name: "CND" },
// ];

const SearchBar = ({ allSubs }) => {
  console.log(allSubs);
  const [subreddits, setSubreddits] = useState(allSubs);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState("");

  const filteredsubreddits =
    query === ""
      ? subreddits
      : subreddits.filter((subreddit) =>
          subreddit.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  function searchList() {
    return (
      <Scroll>
        <FilteredList filteredSubs={filteredsubreddits} />
      </Scroll>
    );
  }
  return (
    <div className="top-16">
      <Combobox value={selected} onChange={setSelected}>
        <div className="mt-1">
          <div className="w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-primary focus:ring-0 bg-secondary"
              displayValue={(subreddit) => subreddit.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 w-full max-h-60 overflow-hidden rounded-md bg-neutral-content py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                        active ? "bg-teal-600 text-white" : "text-gray-900"
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
                          {subreddit.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {/* {searchList()} */}
    </div>
  );
};

export default SearchBar;
