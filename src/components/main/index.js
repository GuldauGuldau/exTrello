// IMPORTS

// React
import React from 'react';

// <Helmet> component for setting the page title/meta tags
import Helmet from 'react-helmet';

import Lists from 'src/components/lists'

/* ReactQL */
import css from './main.scss';

export default () => (
  <div className={css.content}>
    <Helmet
    title="ExTrello"
    meta={[{
      name: 'description',
      content: 'Ex-Trello',
    }]} />
    <Lists />
  </div>
);
