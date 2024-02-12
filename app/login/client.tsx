'use client';

import {
  Button,
  Form,
  Input,
  Label,
  Link,
  TextField,
} from 'react-aria-components';

import { goToHome } from '../serverActions';

export default function ClientPage() {
  let onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(response.status);

    if (response.status > 299) {
      return;
    }
    localStorage.setItem('token', (await response.json()).token);
    goToHome();
  };

  return (
    <div className="flex justify-center container p-32">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl">Login</h1>
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <TextField className="flex flex-col gap-2" name="username">
            <Label>Username</Label>
            <Input className="bg-blue-50 focus:bg-white outline-none p-2 rounded focus:ring-2 focus:ring-offset-1 transition" />
          </TextField>
          <TextField className="flex flex-col gap-2" name="password">
            <Label>Password</Label>
            <Input
              className="bg-blue-50 focus:bg-white outline-none p-2 rounded focus:ring-2 focus:ring-offset-1 transition"
              type="password"
            />
          </TextField>
          <Button
            className="bg-blue-300 hover:bg-blue-100 active:bg-blue-500 rounded p-2 outline-none focus:ring-2 focus:ring-offset-1 transition"
            type="submit"
          >
            Login
          </Button>
          <div className="flex justify-center">
            <Link
              className="text-blue-600 outline-none hover:border-b border-blue-600"
              href="/register"
            >
              Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
