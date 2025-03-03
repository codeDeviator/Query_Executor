import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';  // Import Tailwind CSS through App.css

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
