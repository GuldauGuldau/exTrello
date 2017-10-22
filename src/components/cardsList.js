// IMPORTS

/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'
//import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from 'src/components/ItemTypes';
import Card from "src/components/card";
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend';
// Actions
import { moveCard, moveCardToList } from 'src/actions';
// HOC/decorator to listen to Redux store state
import { connect } from 'react-redux';
// Styles
import css from 'src/components/main/main.scss';


@connect(state => ({ cards: state.cards }))
@DragDropContext(HTML5Backend)
export default class CardsList extends React.Component {

  moveCard = (dragCard, dragList, hoverCard, hoverList) => {
    if(dragList == hoverList) {
      this.props.dispatch(moveCard(dragCard, hoverCard, dragList));
    } else {
      this.props.dispatch(moveCardToList(dragCard, dragList, hoverCard, hoverList));
    }
  }

  render() {
    const {
			connectDragSource,
			connectDropTarget,
		} = this.props;
   	const listCards = this.props.listCards;


    return (
      <div className={css.listBody}>
        {(listCards.length>0) && (listCards.map((card, index) => (
          <Card
           key={index}
           card={card}
           moveCard={this.moveCard}
           index={index}
           list={this.props.list}
           />
        )))}
      </div>
    )
  }
}
