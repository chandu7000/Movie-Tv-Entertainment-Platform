import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index';
import { Provider } from 'react-redux';
import store from './app/store';

const preventZoom = (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    ['+', '-', '=', '0'].includes(event.key)
  ) {
    event.preventDefault();
  }
};

const preventWheelZoom = (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
  }
};

document.addEventListener('keydown', preventZoom);
document.addEventListener('wheel', preventWheelZoom, { passive: false });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

reportWebVitals();