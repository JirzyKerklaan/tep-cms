# Documentation

## Page templating
To use a custom template for a specific page, the page can be assigned a template. You can add:
```json
    "template": "templatename",
```
To your page .json. When adding this to the file, it will search for a ```templatename.ejs``` in the ```src/templates/views/...``` folder. If the file exists, this template will be used for the page.


## Pagebuilder looping:
When your page uses a pagebuilder, you can loop over it in the following way:
```ejs
<% page_builder.forEach(block => { %>
  <%- include(`page_builder/${block.block}`, block.fields) %>
<% }) %>
```
This code includes the blocks you have used in the pagebuilder within ```yourpage.json```.