import {
  MESSAGES_LOADING,
  MESSAGES_SET_DATA,
  MESSAGES_SET_PAGE,
  MESSAGES_CHANGE_SORTING_ORDER,
  MESSAGES_SET_SELECTED_MESSAGES,
  MESSAGES_SET_DETAILS,
  MESSAGES_REMOVE_PROPERTY,
  MESSAGES_UPDATE_PROPERTY,
  MESSAGES_SET_LIMIT,
  MESSAGES_SET_ACTIVITIES,
  MESSAGES_SET_APPOINTMENT,
  MESSAGES_REMOVE_APPOINTMENT,
  MESSAGES_SET_LOCATION_PREDICTION
} from "./constants";
const initialState = {
  loading: false,
  messages: [],
  message: {},
  totalMessages: 0,
  activePage: 1,
  limit: 30,
  offset: 0,
  tableHeaders: [{
  //   title: "Title",
  //   sortingOrder: "",
  //   field: "title",
  // }, {
    title: "Forward Number",
    sortingOrder: null,
    field: "forward_number",
  },
  {
    title: "Text",
    sortingOrder: "",
    field: "text",
  }, {
    title: "Called Number",
    sortingOrder: null,
    field: "called",
  },{
    title: "Answered",
    sortingOrder: null,
    field: "answered",
  },{
    title: "Pressed 1",
    sortingOrder: null,
    field: "pressed1",
  },{
    title: "Total Cost",
    sortingOrder: null,
    field: "total_cost",
  },
   {
    title: "Created",
    sortingOrder: null,
    field: "created_at",
  }, {
    title: "Action",
    sortingOrder: null,
    field: "message_action",
  }],
  activities: [],
  selectedMessages: [],
  appointments: [],
  locationPredictions: [],
};
export function campaignReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case MESSAGES_SET_DATA:
      return {
        ...state,
        messages: action.payload.messages,
        totalMessages: action.payload.total_messages,
      };
    case MESSAGES_SET_DETAILS:
      return {
        ...state,
        message: action.payload
      };
    case MESSAGES_SET_PAGE:
      return {
        ...state,
        activePage: action.payload.activePage,
        offset: action.payload.offset,
      };
    case MESSAGES_CHANGE_SORTING_ORDER:
      state.tableHeaders[action.payload].sortingOrder = state.tableHeaders[action.payload]?.sortingOrder === "" ? "desc" : state.tableHeaders[action.payload]?.sortingOrder === "asc" ? "desc" : "asc";
      return {
        ...state,
        tableHeaders: [...state.tableHeaders]
      };
    case MESSAGES_SET_SELECTED_MESSAGES:
      return {
        ...state,
        selectedMessages: [...action.payload]
      };
    case MESSAGES_REMOVE_PROPERTY:
      return {
        ...state,
        messages: [...state.messages.filter(message => message.id !== action.payload)],
        totalMessages: state.totalMessages - 1
      }
    case MESSAGES_UPDATE_PROPERTY:
      let index = state.messages.findIndex(message => message.id === action.payload.id);
      if (index > -1) {
        state.messages[index] = action.payload;
      }
      return {
        ...state,
        messages: [...state.messages]
      }
    case MESSAGES_SET_LIMIT:
      return {
        ...state,
        limit: action.payload
      };
    case MESSAGES_SET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload
      };
    case MESSAGES_SET_APPOINTMENT:
      return {
        ...state,
        appointments: action.payload
      };
    case MESSAGES_REMOVE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload)
      };
    case MESSAGES_SET_LOCATION_PREDICTION:
      return {
        ...state,
        locationPredictions: action.payload,
      };
    default:
      return state;
  }
}
