'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { Select, SelectItem } from '@nextui-org/react';

export function UserSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    vehicleType: '',
  });

  const router = useRouter(); // Initialize the useRouter hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register/user',
        formData
      );
      console.log('Form submitted successfully', response.data);
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Check if the token was stored successfully
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('Token stored successfully:', storedToken);
        // Navigate to /maps page upon successful registration
        router.push('/map');
      } else {
        console.error('Failed to store token');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
      } else {
        console.error('Error', error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const vehicles = [
    { key: 'Tata', label: 'Tata' },
    { key: 'Mahindra', label: 'Mahindra' },
    { key: 'Ola', label: 'Ola' },
    { key: 'Hyundai', label: 'Hyundai' },
    { key: 'MG', label: 'MG' },
  ];

  return (
    <div className="max-w-full w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to BlockCharge
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Tyler"
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
              placeholder="Durden"
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
            placeholder="projectmayhem@fc.com"
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

        <Label htmlFor="vehicleType">Select your Vehicle Type</Label>
        <Select
          id="vehicleType"
          label="Vehicle Type"
          className="mb-4"
          onChange={(e) =>
            handleChange({ ...e, target: { ...e.target, id: 'vehicleType' } })
          }
          isRequired
        >
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.key} value={vehicle.label}>
              {vehicle.label}
            </SelectItem>
          ))}
        </Select>

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
