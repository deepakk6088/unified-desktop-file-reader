# DocNest — Unified Desktop File Reader

DocNest is a desktop application built with Electron, React, and Vite. It provides a single workspace for organizing local documents and reading supported files without switching between separate applications.

## Features

- **Document library:** Import local PDF, EPUB, and DOCX files into the library.
- **PDF reader:** Open imported PDF files and navigate their pages.
- **Library search and filters:** Find documents using the available search and format-filter controls.
- **Local library storage:** Save imported document information on the device.
- **Offline-first design:** Work with local files without requiring an online account.
- **Desktop interface:** Dark-themed interface with Library, Reader, and Settings sections.
- **Secure Electron configuration:** Uses a preload script, context isolation, and disabled Node.js integration in the renderer.

**Current limitations:** Verify the EPUB and DOCX reading workflows before describing them as supported reader features. The available implementation previously displayed a reader-unavailable message for those formats. Reading progress, bookmarks, and preferences should also be documented as completed features only after testing their current behavior.

## Technology Stack

| Technology | Purpose |
|---|---|
| Electron | Desktop application and native file access |
| React | User interface |
| Vite | Development server and production build |
| JavaScript and JSX | Application logic and UI components |
| CSS Modules | Component-specific styling |
| PDF.js | PDF rendering |
| epub.js | EPUB-related functionality |
| Mammoth | DOCX-related document processing |
| DOMPurify | HTML sanitization where used |
| electron-builder | Packaging the desktop application |

## Project Structure

The main directories are organized as follows. Check the actual repository before submission and adjust this tree if any paths differ.

```
unified-desktop-file-reader/
├── electron/
│   ├── main.js
│   ├── preload.cjs
│   ├── fileHandlers.js
│   └── storage.js
├── public/
├── src/
│   ├── components/
│   │   ├── documents/
│   │   │   ├── DocumentCard.jsx
│   │   │   └── DocumentCard.module.css
│   │   ├── sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.module.css
│   │   └── topbar/
│   │       ├── Topbar.jsx
│   │       └── Topbar.module.css
│   ├── data/
│   │   └── sampleDocuments.js
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   └── AppLayout.module.css
│   ├── pages/
│   │   ├── library/
│   │   │   ├── Library.jsx
│   │   │   └── Library.module.css
│   │   ├── reader/
│   │   │   ├── Reader.jsx
│   │   │   ├── Reader.module.css
│   │   │   ├── PDFReader.jsx
│   │   │   ├── PDFReader.module.css
│   │   │   ├── EPUBReader.jsx
│   │   │   ├── EPUBReader.module.css
│   │   │   └── DOCXReader.jsx
│   │   │   └── DOCXReader.module.css
│   │   └── settings/
│   │       ├── Settings.jsx
│   │       └── Settings.module.css
│   ├── services/
│   │   ├── fileService.js
│   │   ├── libraryService.js
│   │   └── persistenceService.js
│   ├── styles/
│   │   └── tokens.css
│   ├── App.jsx
│   ├── App.module.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
└── README.md
```

### Important files

- `electron/main.js` — Creates the application window and registers Electron handlers.
- `electron/preload.cjs` — Exposes approved desktop functionality to the renderer.
- `electron/fileHandlers.js` — Handles supported file operations.
- `electron/storage.js` — Loads and saves the local document library.
- `src/App.jsx` — Main React application.
- `src/pages/reader/` — Reader interface and format-specific reader components.
- `src/services/` — Application services for document operations.
- `vite.config.js` — Vite configuration.
- `package.json` — Dependencies, scripts, and desktop packaging configuration.

## Requirements

Install the following before running the project:

- Node.js and npm
- Git
- macOS for building and testing the macOS installer

Other operating systems may support development, but the packaging instructions below target macOS.

## Installation and Setup

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd unified-desktop-file-reader
```

Install dependencies:

```bash
npm install
```

Start the development application:

```bash
npm run dev
```

This starts the Vite development server and launches Electron.

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development application |
| `npm run lint` | Check the code with ESLint |
| `npm run build` | Build the React application for production |
| `npm run preview` | Preview the production frontend build |
| `npx electron-builder --mac zip --arm64` | Package the app as a ZIP for Apple Silicon Macs |
| `npx electron-builder --mac dmg --arm64` | Build a macOS DMG installer for Apple Silicon Macs |

The packaging commands assume the relevant Electron Builder configuration is present in `package.json`. A successful frontend build does not by itself confirm that the packaged desktop application works correctly.

## Testing Before Submission

Run the following checks from the project directory:

### 1. Code quality

```bash
npm run lint
```

Confirm that the command finishes without errors.

### 2. Production build

```bash
npm run build
```

Confirm that Vite completes the build successfully.

### 3. Desktop functionality

Run `npm run dev` and manually verify:

- [ ] The application launches.
- [ ] A local PDF can be imported and opened.
- [ ] PDF pages render and page navigation works.
- [ ] Search and format filters behave correctly.
- [ ] Returning to the Library does not remove imported documents.
- [ ] The library persists after restarting the application.
- [ ] Settings and other visible controls behave as expected.
- [ ] Unsupported document formats show a clear message rather than appearing to work.

### 4. Packaged application

Build the macOS package and test the packaged app separately from development mode.

- [ ] The packaged app opens without an IPC error.
- [ ] Importing and saving a document works.
- [ ] The PDF reader and its worker load correctly.
- [ ] The library persists after closing and reopening the app.
- [ ] The DMG installer is created successfully, if submitting a DMG.

Record only the checks that actually pass.

## Data Storage and Privacy

DocNest is designed to work with local documents. The Electron storage implementation saves library metadata in the application's user-data directory rather than inside the repository.

The library stores document information and file paths; removing a document from the library should not be described as deleting the original file unless that behavior is explicitly implemented.

Do not commit personal documents, private file paths, or local application data to GitHub.

## Packaging for macOS

For an Apple Silicon Mac, run:

```bash
npm run build
npx electron-builder --mac dmg --arm64
```

If DMG creation fails, package a ZIP instead:

```bash
npx electron-builder --mac zip --arm64
```

Test the resulting package before sharing it. An unsigned build may trigger macOS security warnings on other machines.

## Repository Hygiene

Keep source code, configuration files, the lockfile, and documentation in Git. Do not commit generated dependencies, build output, local application data, or personal documents.

Before committing, review:

```bash
git status --short
git diff --check
git diff
```

See `.gitignore` for the files and directories excluded from version control.

## Future Improvements

Potential improvements include completing and testing EPUB and DOCX reading, refining reading-progress tracking, adding automated tests, and configuring a custom application icon.

## Author

**Deepak Kumar**

College assignment — Unified Desktop File Reader

## License

No license has been specified yet. Add a license only if you intend to publish the project under one.
