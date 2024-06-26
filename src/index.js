import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import SubredditProvider from "./context/SubredditContext";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <React.StrictMode>
      <BrowserRouter>
         <AuthProvider>
            <SubredditProvider>
               <App/>
            </SubredditProvider>
         </AuthProvider>
      </BrowserRouter>
   </React.StrictMode>
);
