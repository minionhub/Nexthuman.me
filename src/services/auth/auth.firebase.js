import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../store/config/firebase';

const db = firebase.firestore();
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password);
  await firebase.auth().currentUser.reload();
  return firebase.auth().currentUser;
};

export const doSignOut = async () => {
  return await firebase.auth().signOut();
};

export const doPasswordReset = async (email) => {
  return await firebase.auth().sendPasswordResetEmail(email);
};

export const doSendEmailVerification = async () => {
  return await firebase.auth().currentUser.sendEmailVerification({
    url: window.location.origin,
  });
};

export const doUpdateEmail = async (email) => {
  return await firebase.auth().currentUser.updateEmail(email);
};

export const doVerifyPasswordResetCode = async (actionCode) => {
  return await firebase.auth().verifyPasswordResetCode(actionCode);
};

export const doConfirmPasswordReset = async (actionCodem, newPassword) => {
  return await firebase.auth().confirmPasswordReset(actionCodem, newPassword);
};

export const doPasswordUpdate = (password) => {
  firebase.auth().currentUser.updatePassword(password);
};

export const doVerifyEmail = async (actionCode) => {
  return await firebase.auth().applyActionCode(actionCode);
  // return await firebase.auth().currentUser.reload();
};
export const doUpdatePassword = async (password) => {
  return await firebase.auth().currentUser.updatePassword(password);
};
export const reAuthenticate = async (email, password) => {
  var credentials = firebase.auth.EmailAuthProvider.credential(email, password);
  console.log('credentials', credentials);
  return await firebase.auth().currentUser.reauthenticateWithCredential(credentials);
};
export const doRemoveUser = async () => {
  console.log('delete account');
  return await firebase.auth().currentUser.delete();
};
export const onAuthUserListener = (next, fallback) =>
  firebase.auth().onIdTokenChanged((authUser) => {
    if (authUser) {
      db.collection('users')
        .doc(authUser.uid)
        .get()
        .then((snapshot) => {
          const dbUser = snapshot.data();
          if (dbUser != null) {
            authUser = {
              ...dbUser,
              email: authUser.email,
              uid: authUser.uid,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
            };

            db.collection('users').doc(authUser.uid).update({
              emailVerified: authUser.emailVerified,
              email: authUser.email,
              lastLogin: new Date(),
            });
          }
          next(authUser);
        });
    } else {
      fallback();
    }
  });
