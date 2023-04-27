import moment from 'moment';
import { getFirebase } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { v4 as uuidv4 } from 'uuid';
import types from '../types';

const createUser = (uid, data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();

    // create default profile
    const profileId = uuidv4();
    const defaultProfile = {
      name: data.name,
      tagline: 'default',
      bio: '',
      intentions: '',
      experiences: [],
      avatar: '',
      anonymous: false,
      userRef: firestore.doc(`/users/${uid}`),
      id: profileId,
      created: moment().utc().format(),
      updated: moment().utc().format(),
    };
    await firestore.set(
      {
        collection: 'profiles',
        doc: profileId,
      },
      defaultProfile
    );

    data = {
      name: data.name,
      email: data.email,
      emailVerified: false,
      type: 'normal',
      lastLogin: new Date(),
      created: new Date(),
      lastSelectedCharacter: profileId,
      ...data,
    };

    await firestore.set(
      {
        collection: 'users',
        doc: uid,
      },
      data
    );
  };
};
const updateUser = (uid, data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore
      .collection('users')
      .doc(uid)
      .set(
        { ...data },
        {
          merge: true,
        }
      );
  };
};
const deleteUser = (uid) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    return await firestore.collection('users').doc(uid).delete();
  };
};
const setAuthUser = (authUser) => {
  return async (dispatch, getState, getFirestore) => {
    dispatch({ type: types.SET_AUTHUSER, payload: authUser });
    // return authUser;
  };
};
const setLastSelectedCharacter = (uid, characterId) => {
  return async (dispatch, getState, getFirebase) => {
    const firestore = getFirestore();
    await firestore.collection('users').doc(uid).set(
      {
        lastSelectedCharacter: characterId,
      },
      { merge: true }
    );
    dispatch({ type: types.SET_LASTSELECTEDCHARACTER, payload: characterId });
    return characterId;
  };
};

const updateUserType = (uid, type) => {
  return async (dispatch, getState, getFirebase) => {
    const firestore = getFirestore();
    await firestore.collection('users').doc(uid).set(
      {
        type: type,
      },
      { merge: true }
    );
  };
};

const getUserByCharacter = (characterId) => {
  return async (dispatch, getState, getFirebase) => {
    const firestore = getFirestore();
    let snapshot = await firestore.collection('profiles').doc(characterId).get();
    const character = snapshot.data();
    if (!character.userRef) return null;
    const userDoc = await character.userRef.get();
    return userDoc.data();
  };
};

export default {
  createUser,
  setLastSelectedCharacter,
  setAuthUser,
  deleteUser,
  updateUserType,
  updateUser,
  getUserByCharacter,
};
