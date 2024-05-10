import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AiOutlineReddit } from 'react-icons/ai'
import { useContext } from "react";
import { CgProfile } from 'react-icons/cg'
import { CgLogIn } from 'react-icons/cg'

const Navbar = () => {
   const { user } = useContext(AuthContext);
   return (
      <div className="bg-base-100 px-32 p-2 items-center border-b border-primary">
         <div className="flex justify-between">
            {/* Logo */}
            <div className="flex items-center justify-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Greddiit
            </span>
            </div>
            <div className="flex space-x-4 items-center justify-center">
               {user.user ? (
                  <NavLink to="subreddits/all">
                     <div><AiOutlineReddit size={30}/></div>
                  </NavLink>) : (<></>)}
               {user.user ? (
                  <NavLink to="profile">
                     <div><CgProfile size={30}/></div>
                  </NavLink>
               ) : (
                  <NavLink to="login">
                     <div className='text-secondary-content'><CgLogIn size={30}/></div>
                  </NavLink>
               )}
            </div>
         </div>
      </div>
   );
};

export default Navbar;
