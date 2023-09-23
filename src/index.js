import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {QueryContextProvider} from "./components/context/search-users-and-posts.context";
import {AuthModalContextProvider} from "./components/context/auth-pop-up.context";
import {CreatePostModalContextProvider} from "./components/context/create-post-modal.context";
import {PostModalContextProvider} from "./components/context/post-modal.context";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
        <PostModalContextProvider>
        <CreatePostModalContextProvider>
        <AuthModalContextProvider>
             <QueryContextProvider>
                <App/>
            </QueryContextProvider>
        </AuthModalContextProvider>
        </CreatePostModalContextProvider>
        </PostModalContextProvider>

    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
