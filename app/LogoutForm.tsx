'use client';

import { Button, Form } from 'react-aria-components';
import { useFormState } from 'react-dom';

import { logout } from './serverActions';

export default function LogoutForm() {
  const [state, formAction] = useFormState(logout, { error: '' });

  return (
    <Form action={formAction} className="flex flex-col gap-4">
      <Button
        className="bg-blue-300 hover:bg-blue-100 active:bg-blue-500 rounded p-2 outline-none focus:ring-2 focus:ring-offset-1 transition"
        type="submit"
      >
        Logout
      </Button>
    </Form>
  );
}
