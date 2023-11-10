import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import { Game } from './pages/Game';
import { ExplainAndAuthenticate } from './pages/ExplainAndAuthenticate';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ExplainAndAuthenticate />,
    },
    {
        path: '/game',
        element: <Game />,
    },
    {
        path: '*',
        element: <ExplainAndAuthenticate />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} fallbackElement="Loading..." />,
);
