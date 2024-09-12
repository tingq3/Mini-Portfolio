# Minifolio

A simple but powerful portfolio content management system to showcase your best work.

## Features

* Your data is yours -- it's all just Markdown files and JSON configuration.
* Data backups using Git.
* A powerful linking system to show how your skills, projects and knowledge
  relate.

## Note

This is a work-in-progress, with many features still partially-implemented.
Expect frequent updates with breaking changes for the time being. I'll try to
provide migration scripts whenever possible, but depending on the scale of the
changes, they may result in small amounts of data not fully updating. Always
ensure you have backups of your important data.

## Demo

Check out my portfolio at [portfolio.maddyguthridge.com](https://portfolio.maddyguthridge.com).

## Deploying

Deploying is easiest with Docker. Refer to the example `docker-compose.yml` for
the configuration I use.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Testing

* Tests can be run with `npm t`. The dev server will be automatically started
  and stopped.
* Type checking can be run with `npm run check`.
* Linting can be run with `npm run lint`. Automatic fixes can be applied using
  `npm run lint-fix`.

### Building

To create a production version of the app:

```bash
npm run build
```

To run the production server:

```bash
node -r dotenv/config build
```

This requires a `.env` file, which you can create by running
`cp .env.example .env`. Make sure to edit your `.env` file to set its variables
as required.
