# NextJS split template

This is an opinionated [Next.js](https://nextjs.org/) template bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This tries to maintain a separation between API and Client side UI, which is not
the intended use of NextJS 14.

## Stack

- [NextJS](https://nextjs.org/) + [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)

### Other libraries used

- [Zod](https://zod.dev/)
- [Oslo Auth Utilities](https://oslo.js.org/)

## Getting Started

1. Have docker (or podman + docker support) installed.
2. Have NodeJS 20 or higher _even number_ installed. (You can use
   [Volta](https://volta.sh/) or [NVM](https://github.com/nvm-sh/nvm) to manage
   multiple NodeJS versions.)
3. Create a copy of the file `.env.example`, rename it to `.env` and change
   values if needed.
4. Run `docker compose up` in project root directory (or alternative) to start a
   postgresql server.
5. Have pnpm installed (this is faster than npm): `npm i -g pnpm`.
6. Run `pnpm install` to install dependencies.
7. Run `pnpm dev` to start the development server.
8. Open [http://localhost:3000](http://localhost:3000) with your browser to see
   the result.

### Running database migrations

1. Use `pnpm drizzle-kit studio` to view database content in browser. Or use
   a tool like HeidiSQL or DBeaver.
2. When you are in development mode and trying out things locally, use
   `pnpm drizzle-kit push:pg` to update the db according to your schemas at any
   time. Never use this in production.
3. Before committing, run `pnpm drizzle-kit generate:pg` to generate migration
   scripts.
4. Run `pnpm tsx migrate-db.ts` in production/staging to run database
   migrations.

## Conventions

- Write TypeScript.
- Use `app/api` for (json) API routes.
- Keep core logic/views inside `modules` folder organized by feature. Core logic
  **shouldn't depend on NextJS-specific APIs**. Use your best judgement.
- Keep database schemas in relevant feature `modules` and make sure to name them
  `schema.ts`.
- Keep common code that glue NextJS to other parts of the app inside `lib`.
- Keep reusable React components inside `components`.  
  - `IconButton` 👍 Do
  - `DashboardView` 👎 Don't
- Keep pages for each route in the corresponding folder.  
  e.g., Page to show orders by a user  
  example url: `users/123/orders`  
  route handler: `app/users/[id]/orders/page.tsx`
- [Change the theme](https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme)
  in `tailwind.config.ts` according to your design system and use them
  consistently and try to avoid
  [arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Other:

- [Writing commit messages](https://cbea.ms/git-commit/)
