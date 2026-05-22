<p align="center">
  <img width="200" draggable="false" src="./.github/docs/tep-cms.png" alt="TEP CMS Logo"/>
</p>


## 📚 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [File Structure](#file-structure)
- [Developer tips](#tips)

[//]: # (- [Suggestions or Issues]&#40;#contribute&#41;)


<h2 id="features">📦 Features</h2>

- ⚡ **File-based Content** – no DB needed.
- 🧱 **Reusable Blocks** – Use a modular `page_builder`.
- 📁 **Organized Assets** – Assets managed via a modern media library.
- 🎨 **Tailwind Styling** – modular, maintainable styles.
- 🧪 **Easy Local Dev** – run with nearly zero setup.
- 🚀 **Lightweight & Fast** – powered by Express & Twig.
- 👥 **Multiple users** – allow users to have multiple accounts.
- 🕙 **Content scheduler** - easily schedule posts or page releases
- 🔖 **Content versioning** - configurable content versioning of entries
- 🧩 **Headless mode** - use headless mode to implement TEP anywhere
- 🔌 **Plugins** - easily create your own plugins

<h2 id="installation">🛠 Installation</h2>

1. Clone the repo and install dependencies:
   ```bash
   npm install
    ```
2. Copy the example config and customize it:
    ```bash
    cp config.example.ts config.ts
    ```
3. Run the development server
    ```bash
    npm run dev
    ```
4. Build for production
    ```bash
    npm run prod
    ```


<h2 id="file-structure">File Structure</h2>

```bash
tep-cms/
├── content/
│   ├── collections/      # All collections (pages, blogs etc.)
│   ├── globals/          # Global site settings (header, footer settings etc.)
│   ├── navigation/       # Navigation menu's
│   └── schemas/          # Collections & globals schemas
├── core/
│   ├── interfaces/       # Interface exports
│   ├── admin/
│   │   ├── controllers/  # admin route controllers.
│   │   ├── helpers/      # admin route helpers.
│   │   └── services/     # admin controller services.
│   ├── middlewares/      # Global middleware
│   ├── services/         # Route services
│   └── validation/       # Validation system
├── public/
│   ├── assets/
│   │   ├── base/         # Static theme images, icons, etc.
│   │   └── uploads/      # Uploaded images, icons, etc.
│   └── css/              # Compiled styling
├── src/
│   ├── blocks/           # Page_builder blocks & components
│   ├── plugins/          # Installed plugins
│   ├── requests/         # Request validators
│   ├── routes/           # System routing
│   ├── templates/
│   │   ├── layouts/      # Page layouts
│   │   ├── admin/      # /admin views
│   │   └── views/        # Public views
│   ├── types/            # Package definitions
│   └── utils/            # Utility functions
├ config.ts
└ server.ts
```

<h2 id="tips">🧪 Development Tips</h2>

- Use version control to track content
- Turn off caching during the development phase
- [error codes](.github/docs/error-codes.md)

[//]: # (<h2 id="contribute">🙋 Suggestions or Issues</h2>)

[//]: # ()
[//]: # ()
[//]: # (If you find bugs or have suggestions, feel free to open an [issue]&#40;https://github.com/JirzyKerklaan/tep-cms/issues/new&#41;.)

