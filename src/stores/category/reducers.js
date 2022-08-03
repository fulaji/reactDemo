import {
    GET_CATEGORY,
    CATEGORY_SET_DATA
  } from "./constants";
  
  const initialState = {
    categories: [],
  };
  export function categoryReducer(
    state = initialState,
    action
  ) {
    switch (action.type) {
      case GET_CATEGORY:
        return {
          ...state,
          loading: action.payload
        };
      case CATEGORY_SET_DATA:
            return {
                ...state,
                categories: action.payload,
                // totalMessages: action.payload.total_messages,
            };
        
      default:
        return state;
    }
  }