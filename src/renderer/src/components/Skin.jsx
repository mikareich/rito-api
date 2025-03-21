import { useContext } from 'react';
import Swal from 'sweetalert2';
import { UserContext } from './UserProvider';

export default function Skin({ uuid, displayIcon, displayName }) {
  const [user] = useContext(UserContext);
  const equipSkin = async () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        text: 'Sign in first!',
        toast: true,
        position: 'top-end',
        background: '#2D3748',
        color: '#fff',
        showConfirmButton: false,
        timer: 3000,
      });

      return;
    }

    await window.api.equip(uuid, user);

    Swal.fire({
      icon: 'success',
      text: `Equipped ${displayName}`,
      toast: true,
      position: 'top-end',
      background: '#2D3748',
      color: '#fff',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  return (
    <div
      key={uuid}
      className="bg-gray-800 w-full h-56 rounded-lg p-3 gap-3 relative flex flex-col items-center justify-center flex-grow"
    >
      <img src={displayIcon} className="flex-1 h-0" />

      <p>{displayName}</p>

      <button
        className="bg-gray-700 rounded-lg py-3 hover:bg-gray-600 transition-all duration-100 ease-linear w-full"
        onClick={equipSkin}
      >
        Equip
      </button>
    </div>
  );
}
