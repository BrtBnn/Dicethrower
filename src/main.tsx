import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nProvider } from './i18n/I18nProvider';
import App from './App';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Element #root ontbreekt in index.html');

createRoot(container).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
