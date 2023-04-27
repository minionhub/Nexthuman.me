import moment from 'moment';
import { getFirestore } from 'redux-firestore';
import { v4 as uuidv4 } from 'uuid';

const createBook = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    const id = uuidv4();
    await firestore.set(
      {
        collection: 'books',
        doc: data.id,
      },
      {
        ...data,
        created: moment().utc().format(),
        updated: moment().utc().format(),
      }
    );
  };
};

const updateBook = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore
      .collection('books')
      .doc(data.id)
      .set(
        {
          ...data,
          updated: moment().utc().format(),
        },
        { merge: true }
      );
    return data.id;
  };
};

const deleteBook = (bookId) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();

    const pivotSnapshot = await firestore
      .collection('pivot_book_chapter_story')
      .where('bookId', '==', bookId)
      .get();
    const pivotDocs = [];
    pivotSnapshot.forEach((doc) => {
      pivotDocs.push(doc);
    });

    const chapterSnapshot = await firestore
      .collection('chapters')
      .where('bookId', '==', bookId)
      .get();
    const chapterDocs = [];
    chapterSnapshot.forEach((doc) => {
      chapterDocs.push(doc);
    });

    await Promise.all(
      [...pivotDocs, ...chapterDocs].map((item) => {
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

    await firestore.collection('books').doc(bookId).delete();
    return bookId;
  };
};

export default {
  createBook,
  updateBook,
  deleteBook,
};
