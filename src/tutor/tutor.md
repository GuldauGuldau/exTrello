## Создаем структуру данных
Она будет содержать в себе два массива, для списков и карточек. У списка будет свойство cards, где будут хранится карточки, принадлежащие этому списку. Примерная структура такая
```bash
const cards = [
  {
    uuid: ''.
    name: ''
  }
]
```
```bash
const lists = [
  {
    uuid: ''.
    name: '',
    cards: [
      {
        cardUUID: '',
        name: ''
      }
    ]
  }
]
```

## Создаем reducer list и cards

```bash
  config.addReducer('lists', listsReducer);
  config.addReducer('cards', cardsReducer);
```
## Создаем основные компоненты
* компонент Lists, в котором будет выводится списоки 
* компонент Form, содержащий в себе форму, которая будет использоватся для создания списков и карточек
* компонент cardsList для вывода списка всех карточек
* компонент card для вывода отдельной карточки

## Компонент Lists
Делаем основную разметку, выводим список листов, добавляем функцию для создания списка

**Lists.js**
```bash
  render() {
    let lists = this.props.lists;
    return (
      <div className={css.listsWrap}>
        {(lists.length) && (
          lists.map(list => (
            <div key={list.uuid} className={css.listItem}>
              <div className={css.listTitle}>{list.name}</div>
                ....
                // Здесь будет список карточек
                ....
            </div>
          ))
        )}
      </div>
    )
  }
}
```
```bash
  handleCreateList = (e, ref) => {
    if(ref.value) {
      this.props.dispatch(createList(ref.value));
      ref.value = '';
    }
    e.preventDefault();
  }
```
## Добавляем функцию для динамической подгрузки формы 
Параметры isFormList и isFormCard,будут определять для какого элемента показывать форму

**Lists.js**

```bash
  constructor (props) {
      super(props);
      this.state = {
        isFormList: false,
        isFormCard: false
      };
  }
  
  ......
  
  /*когда функция вызывается с одним параметро name, состояние этого name, 
  * меняется на противоположное, когда передается value,
  * состояние становится name = value. Это позволит не грузить одновременно
  * для всех списков по форме. Теперь при клике на ссылку 
  * "Добавить карточку" форма будет добавлена к данному списку,
  * из всех остальных списков форма будет удалена
  */
  
  handlerToggleForm = (name, value=false) => {
    if(value) {
      (this.state[name] == value) ? this.setState({ [name]: false }) : this.setState({ [name]: value })
    } else {
      this.setState({ [name]: !this.state[name] })
    }
  }
  
  .....
  
  render() {
    let lists = this.props.lists;
    return (
      ...
      // форма для создания списка, в качестве submit, передаем соответствующую функцию
      { (this.state.isFormList) ? (
          <div className={css.listItem}>
            <Form
             onSubmit={this.handleCreateList}
             onClose={() => this.handlerToggleForm('isFormList')}
             />
          </div>
        ) : (
          <div className={css.activeLink + ' ' + css.listItem} onClick={() => this.handlerToggleForm('isFormList')}>Создать список</div>
        ) }
      ...
    )
```
**form.js**
```bash
  @connect()
export default class Form extends React.Component {
  setRef = ref => { this.ref = ref }

  render() {
    return (
      <form onSubmit={(e) => this.props.onSubmit(e, this.ref, this.props.uuid, this.props.pos)} >
        <div>
          <input ref={this.setRef} type="text" placeholder="Название..." maxLength="30" dir="auto" />
        </div>
        <button className={css.mainBtn} type="submit">Создать</button>&nbsp;&nbsp;&nbsp;
        <span className={css.activeLink} onClick={() => this.props.onClose()}>Закрыть</span>
      </form>
    )
  }
}
```
## Добавление списка

**action/index.js**

```bash
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
```

**reducers/list.js**


```bash
  case 'CREATE_LIST':
        return [...state, payload];
```

## Выводим список карточек для каждого списка

**lists.js**

```bash
  render() {
    let lists = this.props.lists;
    return (
      ...
      <CardsList
        listCards={list.cards}
        list={list.uuid}
      />
      ...
    )
```
**carsLists.js**
```bash
  @connect(state => ({ cards: state.cards }))
  export default class CardsList extends React.Component {

  render() {
   	const listCards = this.props.listCards;
    return (
      <div className={css.listBody}>
        {(listCards.length>0) && (listCards.map((card, index) => (
          <Card
           key={index}
           card={card}
           list={this.props.list}
           />
        )))}
      </div>
    )
  }
}
```

**card.js**

```bash
@connect(state => ({ cards: state.cards }))
export default class Card extends React.Component {

  render() {

   	const {cardUUID, pos} = this.props.card;
    const cards = this.props.cards;
		const card = cards.find(card => card.uuid == cardUUID)

		return (
			<div className={css.cardItem}>{card.name}</div>
		)
  }
}
```

## Делаем добавление карточек к списку
Добавляем форму к каждому списку, в качестве submit передаем функцию handleCreateCard() для создания карточки
**lists.js**

```bash
{ (this.state.isFormCard == list.uuid) ? (
                <div className={css.cardItem}>
                  <Form
                  onSubmit={this.handleCreateCard}
                  uuid={list.uuid}
                  pos={list.cards.length}
                  onClose={() => this.handlerToggleForm('isFormCard',  list.uuid)}
                  />
                </div>
              ) : (
                <div className={css.activeLink} onClick={() => this.handlerToggleForm('isFormCard', list.uuid)}>Добавить карточку</div>
              ) }
```
(здесь я не совсем удачно сделала, правильней наверно было задать dispatch функцией и cardUUID задавать в экшенах)
```bash
handleCreateCard = (e, ref, list, pos) => {
    const cardUUID = uuid.v4();
    if(ref.value) {
      this.props.dispatch(createCard(ref.value, cardUUID));
      this.props.dispatch(addCardToList(list, cardUUID, (pos+1)));
      ref.value = '';
      this.handlerToggleForm('isFormCard', list);
    }
    e.preventDefault();
  }
```
**reducer/card.js**
```bash
case 'ADD_CARD_TO_LIST':
        return state.map(list => {
          if(list.uuid == payload.listUUID) {
            return ({...list, cards: List(list.cards).push(payload.newCard).toArray()});
          }
          return list;
        });
```

## Реализуем drag-and-drop
В документации есть пример с простой сортировкой. Берем его за основу, адапитруем под наши задачи
@DragDropContext будем использовать на компоненте Cards(списке карточек). @DragSource и @DropTarget на дочернем компоненте card.
Добавляем функцию moveCard, которая будет ловить hover  и диспатчить состояния.
(позже я поняла что hover надо было ловить на родительском элементе, иначе не работает перетаскивание карточки в пустой список (((((

**cardList.js**
```bash
moveCard = (dragCard, dragList, hoverCard, hoverList) => {
    if(dragList == hoverList) {
      this.props.dispatch(moveCard(dragCard, hoverCard, dragList));
    } else {
      this.props.dispatch(moveCardToList(dragCard, dragList, hoverCard, hoverList));
    }
  }
```

**card.js**
```bash
  ...
  const cardSource = {
	beginDrag(props) {
		return {
			card: props.card,
			list: props.list
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragCard = monitor.getItem().card
		const hoverCard = props.card
		const dragList = monitor.getItem().list
		const hoverList = props.list

		// Don't replace items with themselves
		if (dragCard.cardUUID == hoverCard.cardUUID) {
			return
		}
    
    ...

		props.moveCard(dragCard, dragList, hoverCard, hoverList)
  
	},
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
...
```
Добавляем в reducer события. Здесь у меня совсем нехорошо получилось. Это надо переписать!
И Immutable я использую только в редьюссерах, это тоже бы надо переделать((

**reducer/lists.js**
```bash
  case 'MOVE_CARD':
        let res = state.map(list => {
        // если это лист на котором перетаскивали карточку
          if(list.uuid == payload.dragList) {
              let cards = List().concat(List(list.cards).map(card => {
                //если это карточка которую перетаскивали
                if(card.cardUUID == payload.dragCard.cardUUID)
                  //меняем ее позицию на новую
                  return Map(card).set('pos', payload.hoverCard.pos).toObject()
                  
                 // если это карточка с событием hover 
                else if(card.cardUUID == payload.hoverCard.cardUUID)
                // меняем ее позицию на новую
                return Map(card).set('pos', payload.dragCard.pos).toObject()
                else
                  return card
               // сортируем учитывая новые позиций
              }).sort((a, b) => a.pos - b.pos)).toArray();

              return ({...list, cards: cards});
          }
          return list;
        });
        return res;
```

```bash
  case 'MOVE_CARD_TO_LIST':
        return List(state).map(list => {
          // если это список из которого перетаскивали
          if(list.uuid == payload.dragList) {
            let cardsDrag = List(list.cards)
                            // удаляем карточку, которую перетащили
                           .filter(card => card.cardUUID !== payload.dragCard.cardUUID)
                           .map(card => {
                            // сдвигаем позиций всех карточек на одну назад
                             if(card.pos > payload.dragCard.pos) return Map(card).set('pos', +card.pos-1).toObject()
                             return card
                           }).toArray();

            return ({...list, cards: cardsDrag});
          }
          // если это список в который перетаскивали
          if(list.uuid == payload.hoverList) {
            // ищем в этом списке карточку с uuid перетаскиваемой карточки (чтобы не было дублей)
            let isCard = List(list.cards).find(card => {
              return card.cardUUID == payload.dragCard.cardUUID
            });
            // если не находим, то добавляем ее к списку
            if(!isCard) {
              let cardsHover = List().concat(List(list.cards)
                              .map(card => {
                                // сдвигаем позиций карточек ниже по списку на единицу
                                 if(card.pos >= payload.hoverCard.pos) return Map(card).set('pos', +card.pos+1).toObject()
                                 return card
                               })
                               // добавляем карточку
                               .push({cardUUID: payload.dragCard.cardUUID, pos: payload.hoverCard.pos})
                               // сортируем, учитывая изменившиеся позиций
                               .sort((a, b) => a.pos - b.pos)).toArray();
              return ({...list, cards: cardsHover});
            };
          }
          return list
        }).toArray();
```
