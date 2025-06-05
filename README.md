# ResumoGPT

ResumoGPT is a Chrome extension that uses OpenAI's GPT API to summarize selected text. Right click a selection and choose **Resumir seleção via GPT**, then open the popup to read the summary.

## Usage

1. Run `npm install` to install dependencies.
2. Execute `npm run watch` to build the extension in watch mode.
3. Open `chrome://extensions`, enable **Developer mode** and choose **Load unpacked**.
4. Select the `build` directory to load the extension.
5. When prompted, provide your OpenAI API token in the popup.

## Build

To create a production build run:

```bash
npm run build
```

The bundled files will be output to the `build` folder.

## Backend API

A simple Express API with PostgreSQL is provided in the `server/` directory. Use `docker-compose` to start both the database and the API:

```bash
docker-compose up --build
```

Environment variables can be configured by copying `server/.env.example` to `server/.env` and adjusting the values.

The API exposes the following endpoints:

- `POST /register` – create a new user with hashed password.
- `POST /login` – authenticate and receive a JWT token.
- `GET /me` – return the authenticated user (requires `Authorization: Bearer <token>` header).

Sequelize manages the PostgreSQL schema and creates the required tables when the server starts.
The server waits for this initialization to finish before it begins accepting requests.
