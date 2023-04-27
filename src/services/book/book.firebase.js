import moment from 'moment';
import _ from 'lodash';
import firebase from '../../store/config/firebase';

const firestore = firebase.firestore();

export const getAllBooks = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const booksSnapshot = await firestore.collection('books').get();
      let books = [];
      booksSnapshot.forEach((eventRef) => {
        books.push({ ...eventRef.data(), id: eventRef.id });
      });
      resolve(books);
    } catch (err) {
      reject([]);
    }
  });
};

export const getBookForList = (startRef = null, limit = 6) => {
  return new Promise(async (resolve, reject) => {
    let loadMore = true;

    let query = firestore
      .collection('books')
      .where('isUpcoming', '==', false)
      .where('updated', '!=', null)
      .orderBy('updated', 'desc');
    if (startRef) {
      query = query.startAfter(startRef);
    }
    const bookSnapShot = await query.limit(limit).get();

    if (bookSnapShot.size === 0)
      resolve({
        loadMore: false,
        books: [],
        lastRef: null,
      });
    else if (bookSnapShot.size < limit) loadMore = false;
    else {
      try {
        const nextBookSanpShot = await firestore
          .collection('books')
          .where('updated', '!=', null)
          .orderBy('updated', 'desc')
          .startAfter(bookSnapShot.docs[limit - 1])
          .limit(1)
          .get();
        if (nextBookSanpShot.size === 0) loadMore = false;
      } catch (err) {
        loadMore = false;
      }
    }

    let books = [];
    bookSnapShot.forEach((snapShot) => {
      books.push({ ...snapShot.data() });
    });

    const pivotArr = [];
    const pivotSnapShots = await Promise.all(
      books.map((book) => {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await firestore
              .collection('pivot_book_chapter_story')
              .where('bookId', '==', book.id)
              .where('created', '!=', null)
              .orderBy('created', 'desc')
              .get();

            res.forEach((snapShot) => {
              pivotArr.push(snapShot.data());
            });
            resolve(true);
          } catch (err) {
            reject(false);
          }
        });
      })
    );

    if (pivotArr.length > 0) {
      const stories = [];

      const chunkPivotArr = _.chunk(pivotArr, [9]);
      await Promise.all(
        chunkPivotArr.map((item) => {
          return new Promise((resolve, reject) => {
            try {
              firestore
                .collection('stories')
                .where(
                  'id',
                  'in',
                  item.map((itemOne) => itemOne.storyId)
                )
                .get()
                .then((res) => {
                  res.forEach((snapshot) => {
                    stories.push(snapshot.data());
                  });
                  resolve(true);
                });
            } catch (err) {
              resolve(false);
            }
          });
        })
      );

      const nowDateValue = moment().utc().valueOf();
      let eventIds = [];

      books.forEach((item) => {
        const latestStories = [];
        const filterPivot = pivotArr.forEach((itemPivot) => {
          const findStory = stories.find((itemStory) => {
            if (itemPivot.bookId === item.id && itemPivot.storyId === itemStory.id) return true;
            else return false;
          });
          if (findStory) latestStories.push(findStory);
        });
        item.latestStories = latestStories.slice(0, 2);
        item.eventIds = [];
        latestStories.forEach((itemStory) => {
          item.eventIds = [...item.eventIds, ...itemStory.events];
        });

        latestStories.forEach((itemStory) => {
          eventIds = [...eventIds, ...itemStory.events];
        });
      });

      eventIds = _.uniq(eventIds);
      const allUpcomingEvents = [];

      if (eventIds.length > 0) {
        const allUpcomingEventSnapShot = await firestore
          .collection('events')
          .where('to', '>=', moment.utc().format())
          .where('id', 'in', eventIds)
          .get();
        allUpcomingEventSnapShot.forEach((itemSnapshot) => {
          allUpcomingEvents.push(itemSnapshot.data());
        });
      }

      books = books.map((item) => {
        const upcomingEvents = allUpcomingEvents.filter(
          (itemTwo) => item.eventIds.indexOf(itemTwo.id) >= 0
        );
        delete item.eventIds;
        return {
          ...item,
          upcomingEvents,
        };
      });
    }

    resolve({
      books,
      loadMore,
      lastRef: bookSnapShot.docs[bookSnapShot.docs.length - 1],
    });
  });
};

export const getUpcomingBook = (startRef = null, limit = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = firestore
        .collection('books')
        .where('isUpcoming', '==', true)
        .where('updated', '!=', null)
        .orderBy('updated', 'desc');
      if (startRef) query = query.startAfter(startRef);
      if (limit > 0) query = query.limit(limit);

      const bookSnapShot = await query.get();
      const books = [];
      bookSnapShot.forEach((snapShot) => {
        books.push(snapShot.data());
      });
      resolve(books);
    } catch (err) {
      reject([]);
    }
  });
};
