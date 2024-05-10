export const PostReducer = (state, action) => {
   switch (action.type) {
      case 'API_CALL_INIT':
         return { ...state, post: { ...state.post, isLoading: true } }
      case 'API_CALL_FAILURE':
         return { ...state, post: { ...state.post, isLoading: false, error: action.payload } }
      case 'API_CALL_SUCCESS':
         return { ...state, post: { ...state.post, isLoading: false, error: null } }
      case 'SET_NULL':
         return {
            ...state, post: {
               posts_upvoted: [],
               posts_downvoted: [],
               posts_user: null,
               posts_saved: null,
               posts_subreddit: null,
               isLoading: false,
               error: null
            }
         }

      case 'SAVED_POSTS':
         return { ...state, post: { ...state.post, isLoading: false, posts_saved: action.payload } }
      case 'SAVED_POSTS_ADD':
         return {
            ...state,
            post: { ...state.post, isLoading: false, posts_saved: state.post.posts_saved.concat(action.payload) }
         }
      case 'SAVED_POSTS_REMOVE':
         return {
            ...state,
            post: {
               ...state.post, isLoading: false,
               posts_saved: state.post.posts_saved.filter((post) => post._id != action.payload)
            }
         }
      case 'SAVED_POST_ADD_NULL':
         return {
            ...state,
            post: { ...state.post, isLoading: false, posts_saved: [action.payload] }
         }


      case 'AUTHOR_POSTS':
         return { ...state, post: { ...state.post, isLoading: false, posts_user: action.payload } }
      case 'AUTHOR_POSTS_ADD':
         return {
            ...state,
            post: { ...state.post, isLoading: false, posts_user: state.post.posts_user.concat(action.payload) }
         }
      case 'AUTHOR_POSTS_ADD_NULL':
         return { ...state, post: { ...state.post, isLoading: false, posts_user: [action.payload] } }
      case 'AUTHOR_POSTS_REMOVE':
         return {
            ...state,
            post: {
               ...state.post, isLoading: false,
               posts_user: state.post.posts_user.filter((post) => post._id != action.payload)
            }
         }

      case 'UPVOTED_POSTS':
         return { ...state, post: { ...state.post, isLoading: false, posts_upvoted: action.payload } }
      case 'UPVOTED_POSTS_ADD':
         return {
            ...state,
            post: { ...state.post, isLoading: false, posts_upvoted: state.posts_upvoted.concat(action.payload) }
         }
      case 'UPVOTED_POSTS_REMOVE':
         return {
            ...state,
            post: {
               ...state.post, isLoading: false,
               posts_upvoted: state.posts_upvoted.filter((post) => post != action.payload)
            }
         }

      case 'DOWNVOTED_POSTS':
         return { ...state, post: { ...state.post, isLoading: false, posts_downvoted: action.payload } }
      case 'DOWNVOTED_POSTS_ADD':
         return {
            ...state,
            post: { ...state.post, isLoading: false, posts_downvoted: state.posts_downvoted.concat(action.payload) }
         }
      case 'DOWNVOTED_POSTS_REMOVE':
         return {
            ...state,
            post: {
               ...state.post, isLoading: false,
               posts_downvoted: state.posts_downvoted.filter((post) => post != action.payload)
            }
         }
      default:
         return state
   }
}