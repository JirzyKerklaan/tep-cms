export function generateBlockTemplate(type: string, normalizedBlock: string, blockName: string): string {
  if (type === 'page_builder') {
    return `<div class="block block__${normalizedBlock}">
  <% blocks.forEach(block => { %>
    <%- include(\`components/\${block.block}\`, block.fields) %>
  <% }) %>
</div>
`;
  }
  
  // Default to component style
  return `<div class="block__${normalizedBlock}">
  <!-- ${blockName} block -->
</div>
`;
}
