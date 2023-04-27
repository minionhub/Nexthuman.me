import types from '../types';

const initialState = {authUser: null};

const UserReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.SET_AUTHUSER:
      return {
        ...state,
        authUser: action.payload,
      };
    case types.SET_LASTSELECTEDCHARACTER:
      return {
        ...state,
        authUser: {...state.authUser, lastSelectedCharacter: action.payload},
      };
    default:
      return state;
  }
};

export default UserReducer;
