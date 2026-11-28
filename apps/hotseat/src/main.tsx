import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './ui/styles.css';
import './ui/v1.css'; // the approved V1 design system (QA-G-012/QA-V-041/QA-V-044), scoped under .v1

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
