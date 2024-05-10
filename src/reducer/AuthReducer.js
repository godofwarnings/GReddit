export const AuthReducer = (state, action) => {
   console.log("Inside actiom", action, state)
   switch (action.type) {
      case "API_TERMINATE":
         return { user: { ...state.user, isLoading: false, error: null } }
      case "UPDATE_USER":
         return {
            user: {
               ...state.user,
               updatedUser: action.payload
            }
         }
      case "LOGIN_INIT":
         return { user: { ...state.user, isLoading: true } };
      case "LOGIN_SUCCESS":
         return { user: { user: action.payload, isLoading: false, error: null } };
      case "LOGIN_FAILURE":
         return { user: { user: null, isLoading: false, error: action.payload } };
      case "LOGOUT":
         return { user: { user: null, isLoading: true, error: 'No User' } };
      default:
         return state;
   }
};