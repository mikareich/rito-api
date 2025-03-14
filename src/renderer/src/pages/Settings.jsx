export default function Settings() {
  let user;

  const authAccount = () => {};

  return (
    <div className="h-full flex-1 flex flex-col gap-3 items-center text-white p-3">
      <div className="bg-gray-800 w-full h-full gap-3 p-3 rounded-lg relative flex flex-col justify-center items-center NoDrag">
        <p className="text-2xl">
          {user
            ? 'Welcome, ' + user?.acct?.game_name
            : 'Valorant Account Not Authorized'}
        </p>
        <p>{user ? 'PlayerID : ' + user?.sub : null}</p>
      </div>
      <button
        className="NoDrag w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={() => console.info('authorize account')}
      >
        Authorize Account
      </button>
    </div>
  );
}
