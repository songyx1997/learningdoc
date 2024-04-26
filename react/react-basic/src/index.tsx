import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 引入全局样式
import '@/styles/reset.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);
