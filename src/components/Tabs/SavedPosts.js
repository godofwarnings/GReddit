import { useContext } from "react";
import PostSingle from "../PostSingle";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../pages/Loading";

const SavedPosts = () => {
   const { post, user } = useContext(AuthContext)
   console.log("FIRSTSTSTS",user.user.updatedUser.saved_posts)
   return (
      (!user.user.updatedUser.saved_posts ? (<Loading/>) : (<div>
         <div>
            {user.user.updatedUser.saved_posts.map((post_) => (
                  <PostSingle key={post_._id} post={post_}/>
               ))}
         </div>
      </div>))
   );
};

export default SavedPosts;
