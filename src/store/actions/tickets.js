import { getFirestore } from 'redux-firestore';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';

const createTicket = (data) => {
  return async (dispatch, getState, getFirestore) => {
    const firestore = getFirestore();
    await firestore.set(
      {
        collection: 'tickets',
        doc: data.id,
      },
      data
    );

    const snapshot = await firestore.collection('events').doc(data.eventId).get();
    const event = snapshot.data();
    const capacity = event.capacity || 0;
    let participants = event.participants || [];
    if (capacity > participants.length) {
      participants.push(data.characterId);
      await firestore
        .collection('events')
        .doc(data.eventId)
        .set({ participants: participants }, { merge: true });
    }
  };
};

export default {
  createTicket,
};
