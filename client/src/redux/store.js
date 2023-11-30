import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/authSlice";
import SagaReducer from "./features/sagaSlice";
import product from "./features/productSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import MySagas from "./rootSaga";
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  auth: AuthReducer,
  saga: SagaReducer,
  product: product,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});
export const persistor = persistStore(store);
sagaMiddleware.run(MySagas);
