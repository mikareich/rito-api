import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';

export default function Profile() {
  const [currentTier, setCurrentTier] = useState(16);

  const allRanks = useQuery({
    queryKey: ['ranks'],
    initialData: [],
    queryFn: async () => {
      const response = await fetch(
        'https://valorant-api.com/v1/competitivetiers',
      );
      const data = await response.json();
      const latestData = data.data.at(-1);

      return latestData.tiers
        .filter((rank) => !rank.tierName.includes('Unused'))
        .map((rank) => ({
          displayName: rank.tierName,
          displayIcon: rank.largeIcon,
          tier: rank.tier,
        }));
    },
  });

  const currentRank = useMemo(
    () => allRanks.data.find((rank) => rank.tier === currentTier),
    [currentTier, allRanks],
  );

  const updateTier = (delta) => {
    if (!currentRank || !allRanks) return;
    const idx = allRanks.data.indexOf(currentRank);
    const newTier = allRanks.data.at((idx + delta) % allRanks.data.length).tier;

    setCurrentTier(newTier);
  };

  const saveRank = () => {
    Swal.fire({
      icon: 'success',
      text: 'Rank Updated',
      toast: true,
      position: 'top-end',
      background: '#2D3748',
      color: '#fff',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  return (
    <article className="flex flex-col gap-3 justify-center items-center text-white p-3">
      <main className="bg-gray-800 w-full flex-1 gap-3 p-3 rounded-lg relative flex flex-col justify-center items-center NoDrag">
        <h1 className="text-5xl italic p-3">
          {currentRank?.displayName || 'Loading ...'}
        </h1>
        <img
          src={currentRank?.displayIcon}
          className="w-[50%] rounded-full mt-auto"
        />

        <div className="flex gap-3 mt-auto relative w-[100%]">
          <button
            className="NoDrag bg-gray-700 w-[50%] p-3 rounded-lg hover:bg-gray-600 transition-all duration-100 ease-linear"
            onClick={() => updateTier(-1)}
          >
            Previous
          </button>

          <button
            className="NoDrag bg-gray-700 w-[50%] p-3 rounded-lg hover:bg-gray-600 transition-all duration-100 ease-linear"
            onClick={() => updateTier(1)}
          >
            Next
          </button>
        </div>
      </main>

      <button
        className="NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center"
        onClick={saveRank}
      >
        Save Changes
      </button>
    </article>
  );
}
