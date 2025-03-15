/** author: github.com/mikareich. feel free to message me for help/info :) */

import './styles.css';

import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Skins from './pages/Skins';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import UserProvider from './components/UserProvider';

function App() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <main className="bg-gray-900 relative grid grid-cols-[minmax(0px,300px)_1fr] w-screen h-screen text-white">
            <Sidebar />

            <Routes>
              <Route
                path="/"
                exact
                element={
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-5xl italic p-3">ApiValo</h1>
                    <h1 className="text-2xl italic">Valo Calo Espanyalo!</h1>
                  </div>
                }
              />

              <Route path="/profile" Component={Profile} />
              <Route path="/skins" Component={Skins} />
              <Route path="/settings" Component={Settings} />
            </Routes>
          </main>
        </UserProvider>
      </QueryClientProvider>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
