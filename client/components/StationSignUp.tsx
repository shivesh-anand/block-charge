'use client';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PlaceAutocompleteClassic } from './PlaceAutocompleteClassic';
import { APIProvider } from '@vis.gl/react-google-maps';

export function StationSignupForm() {
  const [values, setValues] = useState<Set<string>>(new Set());
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    chargers: [],
  });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      console.log(place.place_id);
      setFormData((prevData) => ({
        ...prevData,
        location: place.formatted_address || '',
      }));
      console.log('Selected Place ID:', place.place_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chargers = Array.from(values).map((type) => ({
      type,
      price: prices[type],
    }));

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register/station',
        { ...formData, chargers }
      );
      console.log('Form Data Submitted Successfully', response.data);
      localStorage.setItem('token', response.data.token);
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('Token Stored Successfully', storedToken);
        router.push('/map');
      } else {
        console.error('Failed to store token');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          setError(error.response.data.message || 'An error occurred');
        } else if (error.request) {
          console.error('Error request:', error.request);
          setError('No response received');
        } else {
          console.error('Error', error.message);
          setError(error.message);
        }
      } else {
        console.error('Error', error);
        setError('An unknown error occurred');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectionChange = (selectedKeys: Set<string | number>) => {
    const stringKeys = new Set<string>(Array.from(selectedKeys).map(String));
    setValues(stringKeys);

    // Initialize prices for newly selected chargers
    const updatedPrices = { ...prices };
    stringKeys.forEach((key) => {
      if (!updatedPrices[key]) {
        updatedPrices[key] = '';
      }
    });

    // Remove prices for deselected chargers
    Object.keys(updatedPrices).forEach((key) => {
      if (!stringKeys.has(key)) {
        delete updatedPrices[key];
      }
    });

    setPrices(updatedPrices);
  };

  const handlePriceChange = (key: string, price: string) => {
    setPrices({
      ...prices,
      [key]: price,
    });
  };

  const chargers = [
    { key: 'Type 1', label: 'Type 1' },
    { key: 'Type 2', label: 'Type 2' },
    { key: 'CHAdeMO', label: 'CHAdeMO' },
    { key: 'CCS combo type 1', label: 'CCS combo type 1' },
    { key: 'CCS combo type 2', label: 'CCS combo type 2' },
  ];

  return (
    <div className="max-w-full w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-scroll overflow-x-hidden">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to BlockCharge
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="johndoe@example.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="location">Location</Label>
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
          >
            <PlaceAutocompleteClassic
              placeholder="Enter a valid location"
              onPlaceSelect={handlePlaceSelect}
            />
          </APIProvider>
        </LabelInputContainer>

        <Select
          label="Charger Types"
          selectionMode="multiple"
          placeholder="Select all chargers available and specify price/minutes"
          selectedKeys={values}
          className="mb-4"
          onSelectionChange={(keys) => handleSelectionChange(new Set(keys))}
          isRequired
        >
          {chargers.map((charger) => (
            <SelectItem key={charger.key} value={charger.key}>
              {charger.label}
            </SelectItem>
          ))}
        </Select>
        <p className="text-small text-default-500 mb-4">
          Selected: {Array.from(values).join(', ')}
        </p>

        {Array.from(values).map((key) => {
          const charger = chargers.find((charger) => charger.key === key);
          if (!charger) return null;

          return (
            <LabelInputContainer key={key} className="mb-4">
              <Label htmlFor={`price-${key}`}>
                {charger.label} Price (₹/min)
              </Label>
              <Input
                id={`price-${key}`}
                type="text"
                placeholder="Enter Price in ₹/min"
                value={prices[key]}
                onChange={(e) => handlePriceChange(key, e.target.value)}
                className="w-full"
                required
              />
            </LabelInputContainer>
          );
        })}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};
