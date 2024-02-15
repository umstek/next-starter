import { Button, Input, Label, Link, TextField } from 'react-aria-components';

import ClientForm from '@/components/ClientForm';

import { onSubmit } from './serverActions';

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex justify-center container p-32">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl">Login</h1>
        <ClientForm
          className="flex flex-col gap-4"
          action={onSubmit}
          initialState={{ error: '' }}
        >
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
        </ClientForm>
      </div>
    </div>
  );
}
