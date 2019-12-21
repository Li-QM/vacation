import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'assets/styles/app.scss';
import App from 'shared/App';

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

export default Root;