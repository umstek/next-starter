import { redirect } from 'next/navigation';

import { validateRequest } from '@/modules/auth/lucia';

import LogoutForm from './LogoutForm';

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/login');
  }
  return (
    <div className="w-full flex justify-center">
      <div className="flex justify-center container p-32">
        <div className="flex flex-col gap-8">
          <h1>Hi, {user.username}!</h1>
          <p>Your user ID is {user.id}.</p>
          <LogoutForm />
        </div>
      </div>
    </div>
  );
}
