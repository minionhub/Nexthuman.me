import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import logger from "redux-logger";

import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase } from "react-redux-firebase";

import firebase from "./config/firebase";
import rootReducer from "./reducers";

// const enhancers = [
// 	reduxFirestore(firebase),
// 	reactReduxFirebase(firebase, {
// 		userProfile: 'users',
// 		useFirestoreForProfile: true,
// 	})
// ]

export const configureStore = preloadedState => {
  const middlewares = [thunk.withExtraArgument(getFirestore)];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const storeEnhancers = [middlewareEnhancer];

  const composedEnhancer = composeWithDevTools(
    ...storeEnhancers,
    reduxFirestore(firebase)
  );

  return createStore(rootReducer, preloadedState, composedEnhancer);
};
