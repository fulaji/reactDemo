
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer,autoRehydrate } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'

// Reducers imported
import { propertyReducer } from "./properties/reducers";
import { authReducer } from "./auth/reducers";
import { userReducer } from "./users/reducers";
import { profileReducer } from "./profile/reducers";

import { messageReducer } from "./messages/reducers";
import { ivrReducer } from "./ivrs/reducers";
import { campaignReducer } from "./campaigns/reducers"
import { categoryReducer } from "./category/reducers";


const rootReducer = combineReducers({
  properties: propertyReducer,
  auth: authReducer,
  users: userReducer,
  profile: profileReducer,
  messages: messageReducer,
  ivrs: ivrReducer,
  campaigns: campaignReducer,
  categories: categoryReducer
});
// // Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method
  storage,
  // Merge two-levels deep.
  stateReconciler: autoMergeLevel2,
  // Whitelist (Save Specific Reducers)
  whitelist: ["auth"],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const middlewares = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);
  let store = createStore(persistedReducer,composeWithDevTools(middleWareEnhancer))
  let persistor = persistStore(store)
  return { store, persistor }
}