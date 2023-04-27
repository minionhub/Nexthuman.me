import { getFirestore } from 'redux-firestore';
import { v4 as uuidv4 } from 'uuid';
import types from '../types';

const createCharacter = (uid, data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    const id = uuidv4();
    const userRef = firestore.collection('users').doc(uid);
    await firestore.set(
      {
        collection: 'profiles',
        doc: id,
      },
      {
        ...data,
        id: id,
        userRef: userRef,
      }
    );
    await firestore.collection('users').doc(uid).set(
      {
        lastSelectedCharacter: id,
      },
      {
        merge: true,
      }
    );
    dispatch({
      type: types.ADD_CHARACTER,
      payload: { characterId: id, ...data, userRef: userRef },
    });
    return { ...data, characterId: id };
  };
};

const updateCharacter = (characterId, data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore
      .collection('profiles')
      .doc(characterId)
      .set(
        {
          ...data,
        },
        { merge: true }
      );
    dispatch({ type: types.UPDATE_CHARACTER, payload: { ...data, characterId } });
    return characterId;
  };
};

const deleteCharacter = (characterId) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore.collection('profiles').doc(characterId).delete();
    dispatch({ type: types.DELETE_CHARACTER, payload: characterId });
    return characterId;
  };
};

const getCharacters = (uid) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    const userRef = firestore.collection('users').doc(uid);
    const profileSnapshots = await Promise.resolve(
      firestore.collection('profiles').where('userRef', '==', userRef).get()
    );
    const profiles = [];
    profileSnapshots.forEach((profileRef) => {
      profiles.push({ ...profileRef.data(), characterId: profileRef.id });
    });
    dispatch({ type: types.SET_CHARACTERS, payload: profiles });
    return profiles;
  };
};

const setCharacters = (characters) => {
  return async (dispatch, getState, getFirestore) => {
    dispatch({ type: types.SET_CHARACTERS, payload: characters });
    return characters;
  };
};

export default {
  createCharacter,
  getCharacters,
  setCharacters,
  updateCharacter,
  deleteCharacter,
};
