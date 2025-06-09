# ResumoGPT

ResumoGPT is a Chrome extension that uses OpenAI's GPT API to summarize selected text. Right click a selection and choose **Resumir seleção via GPT**, then open the popup to read the summary.

## Requirements

This project requires **Node.js 18**. Use `nvm` or a similar tool to ensure this version is installed and active when working on the codebase.

## Usage

1. Navigate to the `frontend` directory and run `npm install` to install dependencies.
2. Execute `npm run dev` inside `frontend` to start Vite in watch mode.
3. Open `chrome://extensions`, enable **Developer mode** and choose **Load unpacked**.
4. Select the `frontend/build` directory to load the extension.
5. When prompted, provide your OpenAI API token in the popup.

## Build

To create a production build with Vite run:

```bash
cd frontend
npm run build
```

The bundled files will be output to the `frontend/build` folder.

## Directory structure

```
frontend/
  └── src/
      ├── popup/       # extension popup UI
      ├── dashboard/   # dashboard page
      └── background/  # background script
server/
  └── src/             # Express API
```

## Backend API

A simple Express API with PostgreSQL is provided in the `server/` directory. Use `docker-compose` to start both the database and the API:

```bash
docker-compose up --build
```

Environment variables can be configured by copying `server/.env.example` to `server/.env` and adjusting the values.

When running the backend locally without Docker you must compile the TypeScript source first:

```bash
cd server
npm install
npm run build
npm start
```

The Docker image performs these steps automatically during `docker-compose up`.

The API exposes the following endpoints:

- `POST /register` – create a new user with hashed password.
- `POST /login` – authenticate and receive a JWT token.
- `GET /me` – return the authenticated user (requires `Authorization: Bearer <token>` header).

Sequelize manages the PostgreSQL schema and creates the required tables when the server starts.
The server waits for this initialization to finish before it begins accepting requests.

## Debugging the API inside Docker

To attach a debugger to the Node.js process in the `api` container, expose the
inspection port and run the server with the `debug` script.

1. Update `docker-compose.yml` to map port `9229` and run the debug command.
   The `api` service should look like:

   ```yaml
   api:
     build: ./server
     restart: always
     command: npm run debug
     ports:
       - "3000:3000"
       - "9229:9229"
   ```

2. Start the containers:

   ```bash
   docker-compose up --build
   ```

3. Attach your debugger (e.g. Chrome DevTools or VS Code) to
   `localhost:9229` and set breakpoints normally.
