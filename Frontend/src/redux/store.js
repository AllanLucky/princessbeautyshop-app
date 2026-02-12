import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartRedux";
import userReducer from "./userRedux";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore,PURGE,REGISTER,REHYDRATE,} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE !== "production", // <-- Vite way
});

// Persistor
export let persistor = persistStore(store);