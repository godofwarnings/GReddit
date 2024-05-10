import { useContext } from "react";
import PostSingle from "../PostSingle";
import { AuthContext } from "../../context/AuthContext";

const PostPage = () => {
   const { post } = useContext(AuthContext)
   return (
      <div>
         <div>
            {post.posts_user &&
               post.posts_user.map((post_) => (
                  <PostSingle key={post_._id} post={post_}/>
               ))}
         </div>
      </div>
   );
};

export default PostPage;
