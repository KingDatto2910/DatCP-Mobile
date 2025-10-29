// redux
import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
// reducers
import { leaders } from "./leaders";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({ leaders }),
    applyMiddleware(thunk, logger)
  );
  return store;
};
