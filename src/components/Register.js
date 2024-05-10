import Button from "./Button";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import RegisterSuccess from "../pages/RegisterSuccess";

const Register = ({ text, iconClass, setStatus }) => {
   const { signup, user } = useContext(AuthContext);
   const [username, setUsername] = useState(null);
   const [emailID, setEmailID] = useState(null);
   const [password, setPassword] = useState(null);
   const [fname, setFname] = useState(null);
   const [lname, setLname] = useState(null);
   const [age, setAge] = useState(null);
   const [registerStatus, setRegisterStatus] = useState(false);
   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (await signup(fname, lname, username, age, emailID, password)) {
            setStatus(true)
         }

      } catch (error) {
         console.log(error)
      }
   };

   return (
      (registerStatus ? (<RegisterSuccess />) : (<div
         className="flex align-center justify-center bg-primary p-4 pt-1 rounded-lg shadow-2xl text-primary-content">
         <div className="flex flex-col">
            <div className="text-center mt-2">
          <span className="rounded-full">
            <div className="bg-primary space-y-2">
              <h1 className="text-5xl font-bold">Register</h1>
              <p className="mt-10 bg-primary-focus p-3">
                Enter your personal details to create an account
              </p>
            </div>
          </span>
            </div>
            <div>
               <form className=" " onSubmit={handleSubmit}>
                  <div className="grid space-y-0">
                     <div className="form-group mt-5">
                        <label className=" text-2xl">
                           First Name
                           <input
                              className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                              name="fname"
                              onChange={(e) => setFname(e.target.value)}
                              type="text"
                              placeholder="first name"
                              value={fname}
                              required
                           />
                        </label>
                     </div>
                     <div className="form-group">
                        <label className="text-2xl mb-0">
                           Last Name
                           <input
                              className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                              name="lname"
                              onChange={(e) => setLname(e.target.value)}
                              type="text"
                              placeholder="last name"
                              value={lname}
                              required
                           />
                        </label>
                     </div>
                     <div className="form-group">
                        <label className=" text-2xl">
                           Username
                           <input
                              className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                              name="username"
                              onChange={(e) => setUsername(e.target.value)}
                              type="text"
                              placeholder="username"
                              value={username}
                              required
                           />
                        </label>
                        <div className="form-group">
                           <label className=" text-2xl">
                              Age
                              <input
                                 className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                                 name="age"
                                 onChange={(e) => setAge(e.target.value)}
                                 type="number"
                                 placeholder="age"
                                 value={age}
                                 required
                              />
                           </label>
                        </div>
                     </div>
                     <div className="form-group">
                        <label className=" text-2xl">
                           Email ID
                           <input
                              className="px-3
                    py-1.5 text-base form-control  w-full
                    placeholder:italic placeholder:text-gray-700 block bg-white rounded-md
                    transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-amber-200 focus:border-black"
                              name="email-id"
                              onChange={(e) => setEmailID(e.target.value)}
                              type="email"
                              placeholder="emailID"
                              value={emailID}
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
                        id="#register"
                        children={text}
                        iconClass={iconClass}
                        type="submit"
                        // isDisabled={user.isLoading}
                     />
                  </div>
               </form>
               <span className="mt-0">{user.error && <div>{user.error}</div>}</span>
            </div>
         </div>
      </div>))
   );
};

export default Register;
