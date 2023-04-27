import _ from 'lodash';
import { getAllCharacters } from '../services/character/character.firebase';
import { getAllEvents } from '../services/event/event.firebase';

// Get characters from the story description
export const getCharactersFromDes = (allCharacters, description) => {
  const identifierStr = 'data-characterid="';
  let characterIds = [];
  if ((!allCharacters && allCharacters.length === 0) || (!description && description.length === 0))
    return [];
  let match = description;
  while (match.indexOf(identifierStr) > -1) {
    const startIndex = match.indexOf(identifierStr);
    const endIndex = match.indexOf('"', startIndex + identifierStr.length + 1);
    characterIds.push(match.substring(startIndex + identifierStr.length, endIndex));
    match = match.substring(endIndex + 1, match.length);
  }

  return _.uniq(characterIds);
};

// Get events from the story description
export const getEventFromDes = (allEvents, description) => {
  const identifierStr = 'data-eventid="';
  let eventIds = [];
  if ((!allEvents && allEvents.length === 0) || (!description && description.length === 0))
    return [];
  let match = description;
  while (match.indexOf(identifierStr) > -1) {
    const startIndex = match.indexOf(identifierStr);
    const endIndex = match.indexOf('"', startIndex + identifierStr.length + 1);
    eventIds.push(match.substring(startIndex + identifierStr.length, endIndex));
    match = match.substring(endIndex + 1, match.length);
  }

  return _.uniq(eventIds);
};

// get all characters, events for the story mentions
export const getAllMentions = async () => {
  let mentions = [];
  const allCharacters = await getAllCharacters();
  mentions = allCharacters.map((item) => {
    return {
      ...item,
      name: item.name || '',
      type: 'character',
    };
  });

  const allEvents = await getAllEvents();
  mentions = [
    ...mentions,
    ...allEvents.map((item) => {
      return {
        ...item,
        name: item.title || '',
        type: 'event',
      };
    }),
  ];

  return mentions.sort((a, b) => {
    const aLowerCase = a.name.toLowerCase();
    const bLowerCase = b.name.toLowerCase();

    if (aLowerCase < bLowerCase) {
      return -1;
    }
    if (aLowerCase > bLowerCase) {
      return 1;
    }
    return 0;
  });
};
