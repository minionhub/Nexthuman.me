Cypress.Commands.add('setTinyMceContent', (tinyMceId, content) => {
  cy.window().then((win) => {
    const editor = win.tinymce.editors[tinyMceId];
    editor.setContent(content);
  });
});
