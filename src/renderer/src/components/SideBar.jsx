import { GoLock, GoPencil, GoSignOut, GoGear } from 'react-icons/go';
import { BsDiscord } from 'react-icons/bs';
import { GiCurvyKnife } from 'react-icons/gi';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="bg-gray-800 h-full w-full relative flex flex-col p-3 gap-3">
      <Link
        to="/skins"
        className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all relative flex justify-center items-center"
      >
        <GiCurvyKnife className="absolute left-3" />
        Skin API
      </Link>

      <Link
        to="/profile"
        className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all relative flex justify-center items-center"
      >
        <GoPencil className="absolute left-3" />
        Rank API
      </Link>

      <Link
        to="/settings"
        className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all relative flex justify-center items-center"
      >
        <GoGear className="absolute left-3" />
        Utility
      </Link>

      <Link
        className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all relative flex justify-center items-center mt-auto"
        onClick={() => window.api.openExternal('https://dsc.gg/valorant')}
      >
        <BsDiscord className="absolute left-3" />
        Official Valo
      </Link>

      <button
        onClick={window.api.exitApp}
        className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all relative flex justify-center items-center"
      >
        <GoSignOut className="absolute left-3" />
        Quit
      </button>
    </aside>
  );
}

export default Sidebar;
