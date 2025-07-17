# Developer Handbook for Kollab-PayloadCMS Template

**This is not a high-level overview of the template structure, but a detailed guide for developers working on the Kollab-PayloadCMS template. It covers the key components, their responsibilities, and how to extend or modify them, as well as best practices for development. See OVERVIEW.md for an introduction to the template.**

## PayloadCMS files

**`src/payload.config.ts`:**

- This is the main configuration file for PayloadCMS. The config file imports the buildConfig and PayloadRequest from payload, these are the essential parts of how the config file works:
  - `buildConfig`: This is the main configuration object that PayloadCMS uses to build the application.
  - `PayloadRequest`: This is a utility that allows you to make requests to the PayloadCMS local API.
- The whole config exports the buildConfig object, which is used by PayloadCMS to run and customize the application. For example you would use this to define the admin panel theme, livepreview settings, logos, favicons as well as more core structural settings such as database settings, collections, globals, cors, plugins, secrets, and more.

```ts
export default buildConfig({
    admin: {
      theme: 'light',
      meta: {},
      components: {} },
    db: postgresAdapter({
      connectionString: PATH_TO_DATABASE,
    }),
```
