import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'universal-cookie';
import 'vite/modulepreload-polyfill';

import { Cupid } from './Cupid.jsx';
import { Dater } from './Dater.jsx';
import './index.css';
import { Manager } from './Manager.jsx';

const cookies = new Cookies(null, { path: '/' });

const accountType = cookies.get("accountType")
export const AccountTypeContext = React.createContext(accountType)

const viewMap = {
  "Cupid": <Cupid />,
  "Manager": <Manager />,
  "Dater": <Dater />
}

if (Object.keys(viewMap).indexOf(accountType) < 0) {
  window.location.href = "/registration/logout/";
}

function createRouterRoot(element) {
  return createBrowserRouter(
    [
      {
        path: "/*",
        element: element
      }
    ]
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <AccountTypeContext.Provider value={accountType}>
    <RouterProvider router={createRouterRoot(viewMap[accountType])} />
  </AccountTypeContext.Provider>
)
