import { Map, List } from 'immutable';

export default function reducer(state, action) {
  const payload = action.payload;

  switch (action.type) {
      case 'CREATE_LIST':
        return [...state, payload];
      case 'ADD_CARD_TO_LIST':
        return state.map(list => {
          if(list.uuid == payload.listUUID) {
            return ({...list, cards: List(list.cards).push(payload.newCard).toArray()});
          }
          return list;
        });
      case 'MOVE_CARD':
        let res = state.map(list => {
          if(list.uuid == payload.dragList) {
              let cards = List().concat(List(list.cards).map(card => {
                if(card.cardUUID == payload.dragCard.cardUUID)
                  return Map(card).set('pos', payload.hoverCard.pos).toObject()
                else if(card.cardUUID == payload.hoverCard.cardUUID)
                return Map(card).set('pos', payload.dragCard.pos).toObject()
                else
                  return card
              }).sort((a, b) => a.pos - b.pos)).toArray();

              return ({...list, cards: cards});
          }
          return list;
        });
        return res;
      case 'MOVE_CARD_TO_LIST':
        return List(state).map(list => {
          if(list.uuid == payload.dragList) {
            let cardsDrag = List(list.cards)
                           .filter(card => card.cardUUID !== payload.dragCard.cardUUID)
                           .map(card => {
                             if(card.pos > payload.dragCard.pos) return Map(card).set('pos', +card.pos-1).toObject()
                             return card
                           }).toArray();

            return ({...list, cards: cardsDrag});
          }

          if(list.uuid == payload.hoverList) {
            let isCard = List(list.cards).find(card => {
              return card.cardUUID == payload.dragCard.cardUUID
            });
            if(!isCard) {
              let cardsHover = List().concat(List(list.cards)
                              .map(card => {
                                 if(card.pos >= payload.hoverCard.pos) return Map(card).set('pos', +card.pos+1).toObject()
                                 return card
                               })
                               .push({cardUUID: payload.dragCard.cardUUID, pos: payload.hoverCard.pos})
                               .sort((a, b) => a.pos - b.pos)).toArray();
              return ({...list, cards: cardsHover});
            };
          }
          return list
        }).toArray();
    }
  return state;
}
