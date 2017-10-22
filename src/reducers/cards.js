
export default function reducer(state, action) {
  switch (action.type) {
      case 'CREATE_CARD':
        return [...state, action.payload];
    }
  return state;
}
