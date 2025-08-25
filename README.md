# Kollab Payload Template

Choose **one** of the following workflows to get up and running.

## 1. Docker Setup

_Recommended: for development and production environments._
This setup uses Docker to run the application, including PostgreSQL and the Payload CMS

**Prerequisites**

- Docker installed
- Docker Compose installed

```bash
git clone git@bitbucket.org:it-kartellet/kollab-payload-template.git kollab-payload-template
cd kollab-payload-template
run pnpm install or npm install
# or yarn install
cp [.env.example](http://_vscodecontentref_/1) .env
# adjust POSTGRES_* in .env if desired

# First run (builds images)
docker compose up --build

# Subsequent runs (detached mode)
docker compose up -d

# To stop & remove containers (keeps volumes):
docker compose down
```

## 2. Local Setup

Prerequisites
Node.js ≥ 18
pnpm (or npm/yarn)
PostgreSQL ≥ 14
remove output="standalone" from next.config.js

### 1. Clone & Install

```bash
git clone git@bitbucket.org:it-kartellet/kollab-payload-template.git kollab-payload-template
cd kollab-payload-template
cp .env.example .env
pnpm install
# or npm install
```

### 2. Configure Environment Variables

Use the `.env.example` file as a reference to set up your environment variables in `.env`. Ensure you have PostgreSQL running and update the database connection string accordingly.

### 3. Start the Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

This will start the development server, and you can access the application at `http://localhost:3000`.

### 4. Access the Admin Panel

You can access the admin panel at `http://localhost:3000/admin`. First time you access the admin panel, you will need to create an admin user. Use the credentials you set in your `.env` file.

### 5. Build for Production

```bash
pnpm build
# or
npm run build
# or
yarn build
```

This will create an optimized production build of your application.

### 6 . Start the Production Server

```bash
pnpm start
# or
npm run start
# or
yarn start
```

### Personalization

You can personalize the template by modifying the following files:

- **Logo**: Replace the logo files in the `/public/assets` directory with your own logo files. If you keep the names the same, no further changes are needed. Logo-on-light is for light backgrounds and logo-on-dark is for dark backgrounds.
- **Favicon**: Replace the favicon files in the `/public/assets` directory with your own favicon files. If you keep the names the same, no further changes are needed. They are named with support for light and dark mode in the browser and admin dashboard and will change according to the user's system preferences if names are kept the same.
- **Colors**: Customize the color scheme by modifying the CSS variables in the `globals.scss` file. The palette names are purposely kept non-descriptive and will apply globally.
- **Component/Layout Color Themes**: Some components and layout-blocks come with support for different color themes. You should update the labels and values in their config.ts or component.tsx files in accordance with your design requirements. These can be found in the `src/website/blocks/yourblock/` directory for layout blocks and `src/website/components/component.tsx` file for individual components.
