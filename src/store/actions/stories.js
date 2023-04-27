import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const createStory = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    const id = uuidv4();
    await firestore.set(
      {
        collection: 'stories',
        doc: data.id,
      },
      {
        ...data,
        created: moment.utc().format(),
        updated: moment.utc().format(),
      }
    );
  };
};

const updateStory = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore
      .collection('stories')
      .doc(data.id)
      .set(
        {
          ...data,
          updated: moment.utc().format(),
        },
        { merge: true }
      );
    return data.id;
  };
};

const deleteStory = (id) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore.collection('stories').doc(id).delete();
    const pivotSnapshot = await firestore
      .collection('pivot_book_chapter_story')
      .where('storyId', '==', id)
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
    return id;
  };
};

const addStoryToChapter = (id, data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();

    // delete if story already added to the chapter
    const pivotSnapshot = await firestore
      .collection('pivot_book_chapter_story')
      .where('storyId', '==', id)
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

    // add story to chapter
    const storiesSnapShot = await Promise.resolve(
      firestore
        .collection('pivot_book_chapter_story')
        .where('bookId', '==', data.bookId)
        .where('chapterId', '==', data.chapterId)
        .get()
    );

    let maxOrder = 0;
    if (storiesSnapShot.size > 0) {
      storiesSnapShot.forEach((snapShot) => {
        const order = snapShot.data().order;
        if (order > maxOrder) maxOrder = order;
      });
      maxOrder += 1;
    }

    const pivotId = uuidv4();
    await firestore.collection('pivot_book_chapter_story').doc(pivotId).set({
      bookId: data.bookId,
      chapterId: data.chapterId,
      storyId: id,
      order: maxOrder,
      created: moment.utc().format(),
      updated: moment.utc().format(),
    });
    return pivotId;
  };
};

export default {
  createStory,
  updateStory,
  deleteStory,
  addStoryToChapter,
};
