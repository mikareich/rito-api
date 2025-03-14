import { useContext } from 'react';
import { UserContext } from '../components/UserProvider';
import Swal from 'sweetalert2';

export default function Settings() {
  const [user, setUser] = useContext(UserContext);

  const authAccount = async () => {
    const newUser = await window.api.auth();
    if (newUser.success) {
      setUser(newUser.success);
      return;
    }

    Swal.fire({
      icon: 'error',
      text: newUser.error,
      toast: true,
      position: 'top-end',
      background: '#2D3748',
      color: '#fff',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  return (
    <div className="h-full flex-1 flex flex-col gap-3 items-center text-white p-3">
      <div className="bg-gray-800 w-full h-full gap-3 p-3 rounded-lg relative flex flex-col justify-center items-center NoDrag">
        <p className="text-2xl">
          {user
            ? `Welcome, ${user.username}`
            : 'Valorant Account Not Authorized'}
        </p>
        {user && <p>Player UUID: {user.uuid}</p>}
      </div>
      <button
        className="NoDrag w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={authAccount}
      >
        Authorize Account
      </button>
    </div>
  );
}
