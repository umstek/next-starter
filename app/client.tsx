'use client';

import { useEffect, useState } from 'react';

import { goToLogin } from './serverActions';

export default function ClientPage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      goToLogin();
      return;
    }
    setToken(token);
  }, []);

  return (
    <div className="flex justify-center container p-32">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl">Hello, world!</h1>
        <p>You are logged in.</p>
      </div>
    </div>
  );
}
