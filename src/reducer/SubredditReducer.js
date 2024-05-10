export const SubredditReducer = (state, action) => {
   switch (action.type) {
      case 'ADD_POST_SUB':
         return {
            isLoading: false,
            error: null,
            subreddit: { ...state.subreddit, posts: state.subreddit.posts.concat(action.payload) }
         }
      case 'REMOVE_POST_SUB':
         return {
            isLoading: false,
            error: null,
            subreddit: {
               ...state.subreddit, posts: state.subreddit.posts.filter((post) =>
                  post._id !=
                  action.payload
               )
            }
         }
      case
      'GET_SUB'
      :
         return {
            ...state,
            isLoading: true
         };
      case
      'SET_SUB_SUCCESS'
      :
         return {
            ...state,
            isLoading: false,
            subreddit: action.payload
         };
      case
      'SET_SUB_FAILURE'
      :
         return {
            ...state,
            isLoading: false,
            error: action.payload
         };
      default:
         return state
   }
}