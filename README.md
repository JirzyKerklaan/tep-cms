<p align="center">
  <img width="200" draggable="false" src="./.github/docs/tep-cms.png" alt="TEP CMS Logo"/>
</p>

<br>

## 📚 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [File Structure](#file-structure)
- [More Information](#content-templates)
- [Developer tips](#tips)
- [Suggestions or Issues](#contribute)

<br>

<h2 id="features">📦 Features</h2>

- ⚡ **File-based Content** – no DB needed.
- 🧱 **Reusable Blocks** – with a modular `page_builder`.
- 📁 **Organized Assets** – with a modern media library.
- 🎨 **SCSS Styling** – modular, maintainable styles.
- 🧪 **Easy Local Dev** – run with nearly zero setup.
- 🚀 **Lightweight & Fast** – powered by Express & EJS.
- 👥 **Multiple users** – Allows the user to have multiple accounts.

<br>

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

<br>

<h2 id="file-structure">File Structure</h2>

```bash
tep-cms/
├── content/
│   ├── collections/    # All collections (pages, blogs etc.)
│   ├── globals/        # Global site settings (header, footer settings etc.)
│   ├── navigation/     # Navigation menu's
│   └── schemas/        # Collections & globals schemas
├── public/
│   ├── assets/
│   │   ├── base/       # Static theme images, icons, etc.
│   │   └── uploads/    # Uploaded images, icons, etc.
│   └── css/            # Compiled SCSS styling
├── styles/             # SCSS styling
├── src/
│   ├── blocks/         # Page_builder blocks & components
│   ├── manager/        # /manager route system
│   ├── middlewares/    # Global middleware
│   ├── routes/         # System routing
│   ├── templates/
│   │   ├── layouts/    # Page layouts
│   │   ├── manager/    # /manager views
│   │   └── views/      # Public views
│   ├── types/          # Package definitions
│   └── utils/          # Utility functions
├ config.ts
└ server.ts
```

<br>

<h2 id="content-templates">🛠 Content & Templates</h2>

### Page templating
To use a custom template for a specific page, the page can be assigned a template. You can add:

```json
    "template": "templatename",
```

To your page .json. When adding this to the file, it will search for a ```templatename.ejs``` in the ```src/templates/views/...``` folder. If the file exists, this template will be used for the page.

### Pagebuilder looping:
When your page uses a pagebuilder, you can loop over it in the following way:

```ejs
<% page_builder.forEach(block => { %>
  <%- include(`page_builder/${block.block}`, block.fields) %>
<% }) %>
```

This code includes the blocks you have used in the pagebuilder within ```yourpage.json```.

<br>

<h2 id="tips">🧪 Development Tips</h2>

- Use version control to track content
- Turn off caching during the development fase
- [error codes](.github/docs/error-codes.md)

<br>

<h2 id="contribute">🙋 Suggestions or Issues</h2>

If you find bugs or have suggestions, feel free to open an [issue](https://github.com/JirzyKerklaan/tep-cms/issues/new).

