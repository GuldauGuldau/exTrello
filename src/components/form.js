// IMPORTS

/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
// HOC/decorator to listen to Redux store state
import { connect } from 'react-redux';
// Styles
import css from 'src/components/main/main.scss';

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
