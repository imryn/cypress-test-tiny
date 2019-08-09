describe('page', () => {

  const url = 'http://storybook.b360-dev.autodesk.com/current/iframe.html?id=dropdowntree--default';

  let dropdown, numberOfCollapsed = 2;

  beforeEach(() => {
    cy.visit(url);
    dropdown = cy.get('.DropdownTree');
  });

  //You can only select one node and the component shows a tree that contain nodes.
  it('one node can be selected', () => {
    dropdown.click();
    cy.get('.TreeNode__toggle--left').click({ multiple: true })
    cy.get('.TreeNode__inner').eq(0).click();
    cy.get('.DropdownTree__input-text').should('have.length', 1);
  });

  // Expand/Collapse functionality is available when clicking on the arrow of the node which has children.
  it('the node was expanded/collapsed', () => {
    dropdown.click();
    cy.get('.TreeNodeExpandIcon').click({ multiple: true });
    cy.get('.TreeNode--collapsed').should('exist')
    cy.get('.TreeNode--expanded').should('exist')
  });

  //You can select all nodes in the tree, even ones with children
  it('select all nodes', () => {
    dropdown.click();
    const dropdownTreeArrowZone = cy.get('.DropdownTree__arrow-zone');
    cy.get('.TreeNode__toggle--left').click({ multiple: true })

    for (let i = 0; i < numberOfCollapsed; i++) {
      cy.get('.TreeNode__inner').eq(i).click();
      cy.get('.DropdownTree__input-text').contains(`Node ${i + 1}`);
      dropdownTreeArrowZone.click();
      if (i != 1) {
        cy.get('.TreeNode__toggle--left').click({ multiple: true })
      }
    }

    cy.get('.TreeNode__toggle--left').eq(1).click();

    for (let i = 2; i < 10; i++) {
      cy.get('.TreeNode__inner').eq(i).click();
      if (i != 9) {
        cy.get('.DropdownTree__input-text').contains(`Node ${i + 1}`);
        dropdownTreeArrowZone.click();
      } else {
        cy.get('.DropdownTree__input-text').contains(`Node 4`);
      }
    }

  });

  //When clicking on the label of a node with children, it will select it and not expand/collapse.
  it('the node was selected and not expand/collapse', () => {
    const expandSelector = '.TreeNode--expanded';

    dropdown.click();
    const treeNodeCollapsed = cy.get('.TreeNode__inner [role=button]');
    treeNodeCollapsed.click();
    cy.get(`${expandSelector} .TreeNode__name`).click();

    cy.get('.DropdownTree__input-text').contains('Node 1');
    cy.get(expandSelector).should('not.exist');
    treeNodeCollapsed.should('not.exist');

  });

  // Cancel should close the dropdown and perform no action.   
  it('no new action was happened', () => {
    const dropdownTreInputText = '.DropdownTree__input-text';
    dropdown.click();
    cy.get('.TreeNode__name').click()
    cy.get(dropdownTreInputText).contains('Node 1');
    dropdown.click();
    cy.get('.Tree__cancel').click();
    cy.get(dropdownTreInputText).contains('Node 1');
  })

  // Clear button should clear the selection.
  it('there is no dropDown in the DOM', () => {
    dropdown.click();
    cy.get('.TreeNode__inner [role=button]').click();
    cy.get('.TreeNode--expanded .TreeNode__name').click();
    cy.get('.DropdownTree__arrow-zone').click();
    cy.get('.Tree__clear').click();
    cy.get('.DropdownTree__tree').should('not.exist')
  });

});
