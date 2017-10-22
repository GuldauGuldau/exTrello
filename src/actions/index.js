const uuid = require('uuid');

export function createList(name) {
  return {
    type: 'CREATE_LIST',
    payload: {
        uuid: uuid.v4(),
        name: name,
        cards: []
      }
  };
}

export function deleteList(uuid) {
  return {
    type: 'DELETE_CARD',
    uuid
  };
}

export function createCard(name, cardUUID) {
  return {
    type: 'CREATE_CARD',
    payload: {
      uuid: cardUUID,
      name: name,
    }
  };
}

export function addCardToList(listUUID, cardUUID, pos) {
  return {
    type: 'ADD_CARD_TO_LIST',
    payload:{
      listUUID: listUUID,
      newCard: {
        cardUUID: cardUUID,
        pos: pos
      }
    }
  }
}

export function moveCard(dragCard, hoverCard, dragList) {
  return {
    type: 'MOVE_CARD',
    payload: {
      dragCard: dragCard,
      hoverCard: hoverCard,
      dragList: dragList
    }
  };
}

export function moveCardToList(dragCard, dragList, hoverCard, hoverList) {
  return {
    type: 'MOVE_CARD_TO_LIST',
    payload: {
      dragCard: dragCard,
      dragList: dragList,
      hoverCard: hoverCard,
      hoverList: hoverList
    }
  };
}
