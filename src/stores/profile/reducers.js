import {
  PROFILE_LOADING,
  PROFILE_SET_PROFILE,
} from "./constants";

const initialState = {
  profile: [],
  loading: false
};
export function profileReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case PROFILE_SET_PROFILE:
      return {
        ...state,
        profile: action.payload
      };
    default:
      return state;
  }
}
