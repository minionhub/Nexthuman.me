import firebase from '../../store/config/firebase';
const db = firebase.firestore();

export const getAllChapters = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const chaptersSnapshot = await db.collection('chapters').get();
      let chapters = [];
      chaptersSnapshot.forEach(eventRef => {
        chapters.push({ ...eventRef.data(), id: eventRef.id });
      });
      resolve(chapters);
    } catch (err) {
      reject([]);
    }
  });
};
