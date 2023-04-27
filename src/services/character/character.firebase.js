import firebase from '../../store/config/firebase';
const db = firebase.firestore();

export const getAllCharacters = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const profileSnapshots = await db.collection('profiles').get();
      let profiles = [];
      profileSnapshots.forEach(profileRef => {
        profiles.push({ ...profileRef.data(), id: profileRef.id });
      });
      resolve(profiles);
    } catch (err) {
      reject([]);
    }
  });
};
