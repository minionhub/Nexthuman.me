import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import CharacterReducer from './character-reducer';
import UserReducer from './user-reducer';
export default combineReducers({
	firestore: firestoreReducer,
	firebase: firebaseReducer,
	characterStore: CharacterReducer,
	userStore: UserReducer,
});
