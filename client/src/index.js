import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index';
import { Provider } from 'react-redux';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

const splash = document.getElementById('cineverse-splash');

window.setTimeout(() => {
  if (!splash) return;
  splash.classList.add('cineverse-splash-hide');
  window.setTimeout(() => splash.remove(), 450);
}, 1350);

reportWebVitals();
