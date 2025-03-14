import React from 'react';
import { GoLock, GoPencil, GoSignOut, GoGear } from 'react-icons/go';
import { BsDiscord } from 'react-icons/bs';
import { GiCurvyKnife } from 'react-icons/gi';

const { app, shell } = window.require('@electron/remote');

const Sidebar = ({ pageSetter }) => {
  const exitApp = () => {
    app.quit();
  };
  return (
    <div className="Sidebar bg-gray-800 h-[100%] w-[30%] relative flex flex-col p-3 gap-3 text-white">
      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={() => {
          pageSetter(1);
        }}
      >
        <GoLock className="absolute left-3" />
        Agent Locker
      </button>
      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={() => {
          pageSetter(3);
        }}
      >
        <GiCurvyKnife className="absolute left-3" />
        Skin API
      </button>
      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={() => {
          pageSetter(2);
        }}
      >
        <GoPencil className="absolute left-3" />
        Rank API
      </button>
      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={() => {
          pageSetter(4);
        }}
      >
        <GoGear className="absolute left-3" />
        Utility
      </button>
      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center mt-auto"
        onClick={() => {
          shell.openExternal('https://dsc.gg/valorant');
        }}
      >
        <BsDiscord className="absolute left-3" />
        Official Valo
      </button>
      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={exitApp}
      >
        <GoSignOut className="absolute left-3" />
        Quit
      </button>
    </div>
  );
};

export default Sidebar;
