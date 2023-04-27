import types from '../types';

const initialState = {characters: []};

const CharacterReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.SET_CHARACTERS:
      return {
        ...state,
        characters: action.payload,
      };
    case types.ADD_CHARACTER:
      return {
        ...state,
        characters: [...state.characters, action.payload],
      };
    case types.UPDATE_CHARACTER:
      const characters = [...state.characters];
      
      return {
        ...state,
        characters: characters.map((item) => {
          if(item.characterId == action.payload.characterId){
            return action.payload;
          }
          return item;
        })
      }
    case types.DELETE_CHARACTER:
      return {
        ...state,
        characters: [...state.characters.filter((item) => {
          if(item.characterId != action.payload){
            return item;
          }
        })]
      }
    default:
      return state;
  }
};

export default CharacterReducer;
