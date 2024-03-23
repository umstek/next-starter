import RegisterForm from './RegisterForm';

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
        <h1 className="text-3xl">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
