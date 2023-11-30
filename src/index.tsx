import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '@/redux/store';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { queryClient } from './http/tanstack/react-query';

const containerElement = document.getElementById('root') as HTMLElement;

const root = createRoot(containerElement);

const element = (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </QueryClientProvider>
);

root.render(element);
