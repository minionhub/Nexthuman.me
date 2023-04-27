import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';
import _ from 'lodash';

const createEvent = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore.set(
      {
        collection: 'events',
        doc: data.id,
      },
      data
    );
  };
};

const updateEvent = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore.collection('events').doc(data.id).set(data, { merge: true });
    return data.id;
  };
};

const getEventsActive = (limit, start) => {
  return async (dispatch, getState, getFirestore) => {
    const now = moment.utc().format();
    const firestore = getFirestore();

    let query = firestore.collection('events').where('to', '>=', now).orderBy('to', 'desc');
    if (start) query = query.startAfter(start);
    const snapshot = await query.limit(limit).get();

    const end = snapshot.docs[snapshot.docs.length - 1];

    const events = snapshot.docs.map((doc) => {
      const e = doc.data();
      e.sold = (e.participants || []).length;
      return e;
    });

    return {
      events: events,
      end: end,
      total: (await firestore.collection('events').where('to', '>=', now).get()).docs.length,
    };
  };
};

const getEventsOwned = (limit, page, characterId) => {
  return async (dispatch, getState, getFirestore) => {
    const now = moment.utc().format();
    const firestore = getFirestore();

    // producers
    let snapshot = await firestore
      .collection('events')
      .where('to', '>=', now)
      .where('producers', 'array-contains', characterId)
      .get();
    let idsProduced = snapshot.docs.map((doc) => doc.id);

    // participants
    snapshot = await firestore
      .collection('events')
      .where('to', '>=', now)
      .where('participants', 'array-contains', characterId)
      .get();
    let idsParticipated = snapshot.docs.map((doc) => doc.id);

    const ids = _.uniq(_.concat(idsProduced, idsParticipated));

    let idsPage = ids;
    if (limit > 0) {
      idsPage = ids.slice((page - 1) * limit, page * limit);
    }

    let events = [];
    if (idsPage.length > 0) {
      let docs = [];
      for (let i = 0; i < idsPage.length; i++)
        docs.push(await firestore.collection('events').doc(idsPage[i]).get());
      // snapshot = await firestore.collection('events').where('id', 'in', idsPage).get();

      events = docs.map((doc) => {
        const e = doc.data();
        e.sold = (e.participants || []).length;
        return e;
      });
    }

    return {
      events: events,
      total: ids.length,
    };
  };
};

const getEventsPrev = (characterId) => {
  return async (dispatch, getState, getFirestore) => {
    const now = moment.utc().format();
    const firestore = getFirestore();

    // producers
    let snapshot = await firestore
      .collection('events')
      .where('to', '<', now)
      .where('producers', 'array-contains', characterId)
      .orderBy('to', 'desc')
      .get();
    let idsProduced = snapshot.docs.map((doc) => doc.id);

    // participants
    snapshot = await firestore
      .collection('events')
      .where('to', '<', now)
      .where('participants', 'array-contains', characterId)
      .orderBy('to', 'desc')
      .get();
    let idsParticipated = snapshot.docs.map((doc) => doc.id);

    let ids = _.uniq(_.concat(idsProduced, idsParticipated));

    ids = ids.slice(0, 4);

    let events = [];
    if (ids.length > 0) {
      snapshot = await firestore.collection('events').where('id', 'in', ids).get();
      events = snapshot.docs.map((doc) => {
        let e = doc.data();
        e.sold = (e.participants || []).length;
        return e;
      });
    }

    return events;
  };
};

const getEventsRelevant = (event) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();

    const snapshot = await firestore
      .collection('events')
      .where('experiences', 'array-contains-any', event.experiences)
      .orderBy('to', 'desc')
      .limit(4)
      .get();

    const events = snapshot.docs.map((doc) => {
      const e = doc.data();
      e.sold = (e.participants || []).length;
      return e;
    });
    return events;
  };
};

const getEvent = (id) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();

    let snapshot = await firestore.collection('events').doc(id).get();
    let event = snapshot.data();
    let producers = [];
    if (event && event.producers) {
      for (const key in event.producers) {
        if (typeof event.producers[key] == 'string') {
          snapshot = await firestore.collection('profiles').doc(event.producers[key]).get();
          const producer = snapshot.data();
          producers.push({ id: event.producers[key], ...producer });
        }
      }
    }
    event.producers = producers;

    let participants = [];
    if (event && event.participants) {
      for (const key in event.participants) {
        if (typeof event.participants[key] == 'string') {
          snapshot = await firestore.collection('profiles').doc(event.participants[key]).get();
          const participant = snapshot.data();
          participants.push({ id: event.participants[key], ...participant });
        }
      }
    }
    event.participants = participants;
    event.sold = participants.length || 0;

    return event;
  };
};

const deleteEvent = (eventId) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore.collection('events').doc(eventId).delete();
    return eventId;
  };
};

const getTickets = (uid) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    const userRef = firestore.collection('users').doc(uid);

    const profileSnapshots = await firestore
      .collection('profiles')
      .where('userRef', '==', userRef)
      .get();

    const ticketSnapshots = await firestore
      .collection('tickets')
      .where(
        'characterId',
        'in',
        profileSnapshots.docs.map((doc) => doc.id)
      )
      .get();

    let tickets = [];
    for (const key in ticketSnapshots.docs) {
      let ticket = ticketSnapshots.docs[key].data();
      let eventSnapshot = await firestore.collection('events').doc(ticket.eventId).get();
      ticket.event = eventSnapshot.data();
      if (ticket.event) {
        let profileSnapshot = await firestore.collection('profiles').doc(ticket.characterId).get();
        ticket.character = profileSnapshot.data();
        tickets.push(ticket);
      }
    }

    return tickets;
  };
};

export default {
  createEvent,
  updateEvent,
  getEventsActive,
  getEventsPrev,
  getEventsOwned,
  deleteEvent,
  getEventsRelevant,
  getEvent,
  getTickets,
};
