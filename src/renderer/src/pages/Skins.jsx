import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Skin from '../components/Skin';

export default function Skins() {
  const [searchedSkin, setSearchedSkin] = useState('');

  const skins = useQuery({
    queryKey: ['skins'],
    initialData: [],
    queryFn: async () => {
      const response = await fetch('https://valorant-api.com/v1/weapons/skins');
      const data = await response.json();

      return data.data.filter(
        (skin) =>
          skin.displayIcon && !skin.displayName.match(/Random|Standart/),
      );
    },
  });

  const filterBySearch = (skin) =>
    skin.displayName.toLowerCase().includes(searchedSkin.toLocaleLowerCase());

  return (
    <div className="space-y-3 p-3 overflow-hidden">
      <input
        value={searchedSkin}
        onChange={(e) => setSearchedSkin(e.target.value)}
        className="bg-gray-700 p-3 rounded-lg w-full"
        placeholder="Search for skin"
      />

      <div className="w-full no-scrollbar max-h-[calc(100%-60px)] space-y-3 overflow-y-auto">
        {skins.isLoading && 'Loading skins...'}

        {skins.isError && 'An error occurred. Please try again...'}

        {skins.isSuccess &&
          skins.data.filter(filterBySearch).map((skin) => {
            return (
              <React.Fragment key={skin.uuid}>
                <Skin {...skin} />
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
