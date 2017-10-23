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

