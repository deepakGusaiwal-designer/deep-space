import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BlogApp from './BlogApp';
import '../styles/global.css';

createRoot(document.getElementById('blog-root')!).render(
  <StrictMode>
    <BlogApp />
  </StrictMode>,
);
