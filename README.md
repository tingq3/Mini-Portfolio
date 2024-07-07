# Portfolio

This is my data-driven portfolio website, built using SvelteKit and TypeScript.

## Features

* The site is entirely built from a `data/` directory, where all information
  about projects, frameworks and languages is contained.
* Validation of all source data, using [Superstruct](https://docs.superstructjs.org/).
* Demos of projects using [Asciinema](https://asciinema.org/) (work in progress).

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

## Building

To create a production version of your app:

```bash
npm run build
```

To run the production server:

```bash
node -r dotenv/config build
```

This requires a `.env` file with the following keys:

```ini
HOST=127.0.0.1  # the hostname to use
PORT=5096  # the port number to use
```

## Using Docker

Refer to the example `docker-compose.yml`.
