import {
  USER_LOADING,
  USER_SET_DATA,
  USER_SET_PAGE,
  USER_SET_LIMIT,
  USER_SET_ALL_USERS,
  USER_SET_DETAILS
} from "./constants";

const initialState = {
  allUsers: [],
  users: [],
  loading: false,
  totalUsers: 0,
  activePage: 1,
  limit: 30,
  offset: 0,
  tableHeaders: [{
    title: "Name",
    sortingOrder: null,
    field: "name",
  }, {
    title: "Email",
    sortingOrder: null,
    field: "email",
  },
  {
    title: "Role",
    sortingOrder: null,
    field: "role",
  }, {
    title: "Created On",
    sortingOrder: null,
    field: "created_on",
  }, 
  {
    title: "Action",
    sortingOrder: null,
    field: "user_action",
  }
  ],
  user: {}
};
export function userReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case USER_SET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload
      };
    case USER_SET_DATA:
      return {
        ...state,
        users: action.payload.users,
        totalUsers: action.payload.total_users,
      };
    case USER_SET_PAGE:
      return {
        ...state,
        activePage: action.payload.activePage,
        offset: action.payload.offset,
      };
    case USER_SET_LIMIT:
      return {
        ...state,
        limit: action.payload
      };
    case USER_SET_DETAILS:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
}
