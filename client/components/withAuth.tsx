// components/withAuth.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      axios
        .get('http://localhost:5000/api/stations/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Authentication error:', error);
          setIsLoading(false);
        });
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Login To Access this Page</div>;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return AuthComponent;
};

export default withAuth;
