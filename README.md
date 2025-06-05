# ResumoGPT

ResumoGPT is a Chrome extension that uses OpenAI's GPT API to summarize text from the current page. Select text and use the context menu or the popup to generate a concise summary.

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
