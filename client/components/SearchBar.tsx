'use client';

import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';

export function SearchBar() {
  const placeholders = [
    'Search For Nearby Charging Stations',
    'Keep Location Access On',
    'Charging Stations near me',
    'Fast charging stations near me',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submitted');
  };
  return (
    <div className="flex w-4/12 justify-center items-center">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
