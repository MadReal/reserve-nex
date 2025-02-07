# ReserveNex

Reservation Management for restaurants.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

## Deployment

Add additional notes about how to deploy this on a live system.

### Connecting to Supabase and Prisma

1. Create a project in [Vercel](https://vercel.com/) by linking it to the GitHub repository of this project.
2. Integrate the project with [Supabase](https://supabase.io/), which will automatically generate the necessary environment variables. Ensure you have the following variables:

   - `SUPABASE_JWT_SECRET`
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`

3. Utilize Prisma to interact with your database. Run the following command to generate Prisma client and create your database schema:

   ```bash
   prisma generate
   ```

### Email Functionality

To send emails from the website:

1. Create an account on [Resend](https://resend.com/) to obtain API keys.
2. Add the API keys obtained from Resend to your environment variables.

### Deployment Commands

To ensure your database is set up and your website is built properly on Vercel, use the following deployment command:

```bash
prisma generate && nuxt build
```

## Built With

- [Nuxt.js](https://nuxtjs.org/) - The web framework used
- [Supabase](https://supabase.io/) - Database
- [Resend](https://resend.com/) - Email service
- [Prisma](https://www.prisma.io/) - Database toolkit

# ENV

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=

# See the documentation for all the connection string options: https://pris.ly/d/connection-strings - Connect to Supabase with PgBouncer.

POSTGRES_URL=

# Direct connection to the database. Used for migrations.

POSTGRES_URL_NON_POOLING=

# EMAILS https://resend.com/

RESEND_API_KEY=
ADMIN_EMAIL="PixelVision <email@email.com>"
