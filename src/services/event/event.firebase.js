import moment from 'moment';
import firebase from '../../store/config/firebase';
const firestore = firebase.firestore();

export const getAllEvents = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const eventsSnapshot = await firestore.collection('events').get();
      let events = [];
      eventsSnapshot.forEach((eventRef) => {
        events.push({ ...eventRef.data(), id: eventRef.id });
      });
      resolve(events);
    } catch (err) {
      reject([]);
    }
  });
};

export const getUpcomingEvents = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const now = moment.utc().format();
      const eventsSnapshot = await firestore.collection('events').where('from', '>=', now).get();
      let events = [];
      eventsSnapshot.forEach((eventRef) => {
        events.push({ ...eventRef.data(), id: eventRef.id });
      });
      resolve(events);
    } catch (err) {
      reject([]);
    }
  });
};

export const getEventsWithIds = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const events = [];
      const eventsSnapShot = await firestore.collection('events').where('id', 'in', ids).get();
      eventsSnapShot.forEach((item) => {
        events.push(item.data());
      });
      resolve(events);
    } catch (err) {
      resolve([]);
    }
  });
};
