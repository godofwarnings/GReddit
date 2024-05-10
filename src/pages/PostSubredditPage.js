import PostSingle from "../components/PostSingle";

const PostSubredditPage = ({posts}) => {
  return (
    <div>
      {posts &&
        posts.map((post) => <PostSingle key={post._id} post={post} />)}
    </div>
  );
};

export default PostSubredditPage;
