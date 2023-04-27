import moment from 'moment';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../store/config/firebase';
const firestore = firebase.firestore();

export const createStory = (data) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    try {
      firestore
        .collection('stories')
        .doc(id)
        .set({
          ...data,
          id: id,
          created: moment.utc().format(),
          updated: moment.utc().format(),
        })
        .then((res) => {
          resolve(id);
        })
        .catch((err) => {
          reject(false);
        });
    } catch (err) {
      reject(false);
    }
  });
};

export const updateStory = (data) => {
  return new Promise((resolve, reject) => {
    try {
      firestore
        .collection('stories')
        .doc(data.id)
        .set(
          {
            ...data,
            updated: moment.utc().format(),
          },
          { merge: true }
        )
        .then((res) => {
          resolve(data.id);
        })
        .catch((err) => {
          reject(false);
        });
    } catch (err) {
      reject(false);
    }
  });
};

export const getStoriesOfChapter = async (bookId, chapterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pivotSnapshot = await firestore
        .collection('pivot_book_chapter_story')
        .where('bookId', '==', bookId)
        .where('chapterId', '==', chapterId)
        .get();
      const pivotsArr = [];
      pivotSnapshot.forEach((eventRef) => {
        pivotsArr.push({ ...eventRef.data() });
      });

      const storySnapShot = await firestore
        .collection('stories')
        .where(
          'id',
          'in',
          pivotsArr.map((item) => item.storyId)
        )
        .get();

      const stories = [];
      let allWriterIds = [];
      storySnapShot.forEach((snapShot) => {
        const data = snapShot.data();
        const findPivot = pivotsArr.find((item) => item.storyId === data.id);
        stories.push({ ...data, order: findPivot.order || 0 });
        allWriterIds = _.uniq(_.concat(allWriterIds, data.writers));
      });

      // get all writers of story
      const allWriters = await Promise.all(
        allWriterIds.map((item) => {
          return new Promise((resolve, reject) => {
            firestore
              .collection('profiles')
              .doc(item)
              .get()
              .then((snapshot) => {
                resolve({
                  ...snapshot.data(),
                  id: item,
                });
              });
          });
        })
      );

      stories.forEach((storyItem) => {
        const writers = [];
        if (storyItem.writers.length > 0) {
          storyItem.writers.forEach((writerId) => {
            const findWriter = allWriters.find((item) => item.id === writerId);
            if (findWriter) writers.push(findWriter);
          });
        }
        storyItem.writers = writers;
      });

      resolve(stories);
    } catch (err) {
      reject([]);
    }
  });
};

export const getStoriesIncludingCharacter = (characterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const writerStorySnapshot = await firestore
        .collection('stories')
        .where('writers', 'array-contains', characterId)
        .get();
      const mentionedStorySnapshot = await firestore
        .collection('stories')
        .where('characters', 'array-contains', characterId)
        .get();

      let allStories = [];
      writerStorySnapshot.forEach((snapshot) => {
        allStories.push(snapshot.data());
      });
      mentionedStorySnapshot.forEach((snapshot) => {
        allStories.push(snapshot.data());
      });

      allStories = allStories.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      resolve(
        allStories.sort((a, b) => {
          if (!a.updated) return 1;
          if (!b.updated) return -1;
          if (!a.updated && !b.updated) return 0;
          return moment(b.updated).utc().valueOf() - moment(a.updated).utc().valueOf();
        })
      );
    } catch (err) {
      resolve([]);
    }
  });
};

export const getAllStories = (hasChapter = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      let storiesSnapshot;
      if (hasChapter)
        storiesSnapshot = await firestore.collection('stories').where('chapterId', '>', '').get();
      else storiesSnapshot = await firestore.collection('stories').get();
      let stories = [];
      storiesSnapshot.forEach((ref) => {
        stories.push({ ...ref.data(), id: ref.id });
      });
      resolve(stories);
    } catch (err) {
      reject([]);
    }
  });
};

export const getStory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const storySnapshot = await firestore.collection('stories').doc(id).get();
      let story = storySnapshot.data();

      const writers = [];
      const characters = [];

      let allProfileIds = [...story.writers, ...story.characters];
      allProfileIds = _.uniq(allProfileIds);

      const allProfiles = await Promise.all(
        allProfileIds.map((item) => {
          return new Promise((resolve, reject) => {
            firestore
              .collection('profiles')
              .doc(item)
              .get()
              .then((snapshot) => {
                resolve({
                  ...snapshot.data(),
                  id: item,
                });
              });
          });
        })
      );

      allProfiles.forEach((profile) => {
        if (story.writers.indexOf(profile.id) >= 0) writers.push(profile);
        if (story.characters.indexOf(profile.id) >= 0) characters.push(profile);
      });

      const events = [];
      if (story.events && story.events.length > 0) {
        const eventsSnapShot = await firestore
          .collection('events')
          .where('id', 'in', story.events)
          .get();
        eventsSnapShot.forEach((item) => {
          events.push(item.data());
        });
      }

      resolve({
        ...story,
        writers,
        characters,
        events,
      });
    } catch (err) {
      resolve(null);
    }
  });
};

export const deleteStory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      await firestore.collection('stories').doc(id).delete();
      resolve(true);
    } catch (err) {
      reject(false);
    }
  });
};
