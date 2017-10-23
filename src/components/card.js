// IMPORTS

/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import HTML5Backend from 'react-dnd-html5-backend';

// HOC/decorator to listen to Redux store state
import { connect } from 'react-redux';
// Styles
import css from 'src/components/main/main.scss';

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

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragCard.pos < hoverCard.pos && hoverClientY < hoverMiddleY) {
			//return
		}

		// Dragging upwards
		if (dragCard.pos < hoverCard.pos && hoverClientY > hoverMiddleY) {
			return
		}

		props.moveCard(dragCard, dragList, hoverCard, hoverList)

	},
}

@connect(state => ({ cards: state.cards }))
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
export default class Card extends React.Component {

  render() {
    const {
			connectDragSource,
			connectDropTarget,
		} = this.props
   	const {cardUUID, pos} = this.props.card;
    const cards = this.props.cards;
		const card = cards.find(card => card.uuid == cardUUID)

		return connectDragSource(
			connectDropTarget(<div className={css.cardItem}>{card.name}</div>),
		)
  }
}
