import {
  PROPERTIES_LOADING,
  PROPERTIES_SET_DATA,
  PROPERTIES_SET_PAGE,
  PROPERTIES_CHANGE_SORTING_ORDER,
  PROPERTIES_SET_SELECTED_PROPERTIES,
  PROPERTIES_SET_DETAILS,
  PROPERTIES_REMOVE_PROPERTY,
  PROPERTIES_UPDATE_PROPERTY,
  PROPERTIES_SET_LIMIT,
  PROPERTIES_SET_ACTIVITIES,
  PROPERTIES_SET_APPOINTMENT,
  PROPERTIES_REMOVE_APPOINTMENT,
  PROPERTIES_SET_LOCATION_PREDICTION,
  ALL_PROPERTIES_SET_ACTIVITIES,
  PROPERTIES_SET_STATS
} from "./constants";
const initialState = {
  loading: false,
  properties: [],
  property: {},
  totalProperties: 0,
  activePage: 1,
  limit: 30,
  offset: 0,
  tableHeaders: [{
    title: "Sale Date",
    sortingOrder: "",
    field: "sale_date",
  }, {
    title: "Stage",
    sortingOrder: null,
    field: "stage",
  },
  {
    title: "Property Address",
    sortingOrder: "",
    field: "address",
  }, {
    title: "City",
    sortingOrder: "",
    field: "city",
  }, {
    title: "County",
    sortingOrder: "",
    field: "county",
  }, {
    title: "Equity %",
    sortingOrder: "",
    field: "estimated_value",
  }, {
    title: "Last Contact Date",
    sortingOrder: "",
    field: "last_contacted_on",
  }, {
    title: "Assigned To",
    sortingOrder: null,
    field: "assigned_to",
  }, {
    title: "Action",
    sortingOrder: null,
    field: "property_action",
  }],
  activities: [],
  allActivity:[],
  // tableHeaders: [{
  //   title: "Address", 
  //   sortingOrder: "",
  //   field: "address",
  // }, {
  //   title: "Sale Date", 
  //   sortingOrder: "",
  //   field: "sale_date",
  // }, {
  //   title: "Contact", 
  //   sortingOrder: "",
  //   field: "contact_no",
  // }, {
  //   title: "Owner's Name", 
  //   sortingOrder: "",
  //   field: "owner",
  // }, {
  //   title: "Source",
  //   sortingOrder: "",
  //   field: "source",
  // },{
  //   title: "Image",
  //   sortingOrder: null,
  //   field: "property_image",
  // },{
  //   title: "Action",
  //   sortingOrder: null,
  //   field: "property_action",
  // }],
  selectedProperties: [],
  appointments: [],
  locationPredictions: [],
  stats: {}
};
export function propertyReducer(state = initialState, action) {
  switch (action.type) {
    case PROPERTIES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case PROPERTIES_SET_DATA:
      return {
        ...state,
        properties: action.payload.properties,
        totalProperties: action.payload.total_properties,
      };
    case PROPERTIES_SET_DETAILS:
      return {
        ...state,
        property: action.payload
      };
    case PROPERTIES_SET_PAGE:
      return {
        ...state,
        activePage: action.payload.activePage,
        offset: action.payload.offset,
      };
    case PROPERTIES_CHANGE_SORTING_ORDER:
      state.tableHeaders[action.payload].sortingOrder = state.tableHeaders[action.payload]?.sortingOrder === "" ? "desc" : state.tableHeaders[action.payload]?.sortingOrder === "asc" ? "desc" : "asc";
      return {
        ...state,
        tableHeaders: [...state.tableHeaders]
      };
    case PROPERTIES_SET_SELECTED_PROPERTIES:
      return {
        ...state,
        selectedProperties: [...action.payload]
      };
    case PROPERTIES_REMOVE_PROPERTY:
      return {
        ...state,
        properties: [...state.properties.filter(property => property.id !== action.payload)],
        totalProperties: state.totalProperties - 1
      }
    case PROPERTIES_UPDATE_PROPERTY:
      let index = state.properties.findIndex(property => property.id === action.payload.id);
      if (index > -1) {
        state.properties[index] = action.payload;
      }
      return {
        ...state,
        properties: [...state.properties]
      }
    case PROPERTIES_SET_LIMIT:
      return {
        ...state,
        limit: action.payload
      };
    case PROPERTIES_SET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload
      };
    case PROPERTIES_SET_APPOINTMENT:
      return {
        ...state,
        appointments: action.payload
      };
    case PROPERTIES_REMOVE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload)
      };
    case PROPERTIES_SET_LOCATION_PREDICTION:
      return {
        ...state,
        locationPredictions: action.payload,
      };
    case PROPERTIES_SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case ALL_PROPERTIES_SET_ACTIVITIES:
        return {
          ...state,
          allActivity: action.payload
      };
    default:
      return state;
  }
}
