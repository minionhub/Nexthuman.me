import { getFirestore } from 'redux-firestore';
import moment from 'moment';

export const createChapter = (data) => {
  return getFirestore().collection('chapters').doc(data.id).set(data);
};

export const getChaptersOfBook = (bookId) => {
  return getFirestore()
    .collection('chapters')
    .where('bookId', '==', bookId)
    .where('created', '!=', null)
    .orderBy('created', 'asc')
    .get();
};

export const editChapter = (data) => {
  return getFirestore()
    .collection('chapters')
    .doc(data.id)
    .set({ ...data, updated: moment.utc().format() }, { merge: true });
};

export const deleteChapter = async (chapterId) => {
  const pivotSnapshot = await getFirestore()
    .collection('pivot_book_chapter_story')
    .where('chapterId', '==', chapterId)
    .get();
  const pivotDocs = [];
  pivotSnapshot.forEach((doc) => {
    pivotDocs.push(doc);
  });
  await Promise.all(
    pivotDocs.map((item) => {
      return new Promise(async (resolve, reject) => {
        try {
          await item.ref.delete();
          resolve(true);
        } catch (err) {
          resolve(true);
        }
      });
    })
  );

  return getFirestore().collection('chapters').doc(chapterId).delete();
};
