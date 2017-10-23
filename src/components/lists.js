// IMPORTS

/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
// HOC/decorator to listen to Redux store state
import { connect } from 'react-redux';
// Styles
import css from 'src/components/main/main.scss';
// Actions to add/remove event
import { createList, createCard, addCardToList, moveCard, moveCardToList } from 'src/actions';
// components
import Form from "src/components/form";
import Card from "src/components/card";
import CardsList from "src/components/cardsList";

const uuid = require('uuid');

@connect(state => ({ lists: state.lists }))
export default class Lists extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
        isFormList: false,
        isFormCard: false
      };
  }

  handleCreateList = (e, ref) => {
    // TODO Add message "please enter list name" if empty ref
    if(ref.value) {
      this.props.dispatch(createList(ref.value));
      ref.value = '';
      this.handlerToggleForm('isFormList');
    }
    e.preventDefault();
  }

  handleCreateCard = (e, ref, list, pos) => {
    const cardUUID = uuid.v4();
    // TODO Add message "please enter card name" if empty ref
    if(ref.value) {
      this.props.dispatch(createCard(ref.value, cardUUID));
      this.props.dispatch(addCardToList(list, cardUUID, (pos+1)));
      ref.value = '';
      this.handlerToggleForm('isFormCard', list);
    }
    e.preventDefault();
  }

  handlerToggleForm = (name, value=false) => {
    if(value) {
      /* if value did not change close form isFormCard=false */
      (this.state[name] == value) ? this.setState({ [name]: false }) : this.setState({ [name]: value })
    } else {
      this.setState({ [name]: !this.state[name] })
    }
  }

  render() {
    let lists = this.props.lists;
    return (
      <div className={css.listsWrap}>
        {(lists.length) && (
          lists.map(list => (
            <div key={list.uuid} className={css.listItem}>
              <div className={css.listTitle}>{list.name}</div>
                <CardsList
                 listCards={list.cards}
                 list={list.uuid}
                />

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
            </div>
          ))
        )}
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
      </div>
    )
  }
}
