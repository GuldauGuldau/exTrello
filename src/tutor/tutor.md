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
