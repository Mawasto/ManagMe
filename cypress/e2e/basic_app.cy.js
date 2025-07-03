/// <reference types="cypress" />

describe('Logowanie', () => {
  it('Logowanie z loginem dev i hasłem dev działa', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();
    cy.contains('Wyloguj').should('exist');
  });
});

describe('Dodawanie projektu przez ProjectForm', () => {
  it('Dodaje projekt i usuwa go po teście', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();

    // Wypełnij formularz ProjectForm
    cy.contains('label', 'Nazwa:').parent().find('input').type('Projekt Cypress');
    cy.contains('label', 'Opis:').parent().find('textarea').type('Testowy opis projektu');
    cy.get('button').contains('Zapisz').click();

    cy.wait(1000); // poczekaj na pojawienie się projektu na liście
    cy.contains('Projekt Cypress').should('exist');

    cy.wait(2000); // poczekaj 2 sekundy przed usunięciem
    cy.contains('Projekt Cypress').parent('li').within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.contains('Projekt Cypress', {timeout: 6000}).should('not.exist');
  });
});

describe('Dodawanie historyjki przez StoryForm', () => {
  it('Dodaje historyjkę do projektu i usuwa projekt po teście', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();

    // Dodaj projekt
    cy.contains('label', 'Nazwa:').parent().find('input').type('Projekt Cypress');
    cy.contains('label', 'Opis:').parent().find('textarea').type('Testowy opis projektu');
    cy.get('button').contains('Zapisz').click();
    cy.wait(1000);
    cy.get('li').contains('Projekt Cypress').should('exist');

    // Wybierz projekt
    cy.get('li').contains('Projekt Cypress').parent('li').within(() => {
      cy.get('button').contains('Wybierz projekt').click();
    });

    // Dodaj historyjkę
    cy.contains('h2', 'Dodaj nową historyjkę').should('be.visible')
      .closest('form').within(() => {
        cy.get('input').first().type('Historyjka Cypress');
        cy.get('textarea').first().type('Opis historyjki');
        cy.get('button').contains('Dodaj historyjkę').click();
      });
    cy.contains('Historyjka Cypress').should('exist');

    // Usuń projekt
    cy.get('li').contains('Projekt Cypress').parent('li').within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.wait(1000);
    cy.contains('Projekt Cypress', {timeout: 6000}).should('not.exist');
  });
});

describe('Dodawanie zadania przez TaskForm', () => {
  it('Dodaje zadanie do historyjki i usuwa projekt po teście', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();

    // Dodaj projekt
    cy.contains('label', 'Nazwa:').parent().find('input').type('Projekt Cypress');
    cy.contains('label', 'Opis:').parent().find('textarea').type('Testowy opis projektu');
    cy.get('button').contains('Zapisz').click();
    cy.wait(1000);
    cy.get('li').contains('Projekt Cypress').should('exist');

    // Wybierz projekt
    cy.get('li').contains('Projekt Cypress').parent('li').within(() => {
      cy.get('button').contains('Wybierz projekt').click();
    });

    // Dodaj historyjkę
    cy.contains('h2', 'Dodaj nową historyjkę').should('be.visible')
      .closest('form').within(() => {
        cy.get('input').first().type('Historyjka Cypress');
        cy.get('textarea').first().type('Opis historyjki');
        cy.get('button').contains('Dodaj historyjkę').click();
      });
    cy.contains('Historyjka Cypress').should('exist');

    // Dodaj zadanie
    cy.contains('Historyjka Cypress').parent().within(() => {
      cy.contains('h3', 'Dodaj zadanie').should('be.visible')
        .closest('form').within(() => {
          cy.get('input').eq(0).type('Zadanie Cypress');
          cy.get('input').eq(1).type('Opis zadania');
          cy.get('button').contains('Dodaj zadanie').click();
        });
    });
    cy.contains('Zadanie Cypress').should('exist');

    // Usuń projek
    cy.get('li').contains('Projekt Cypress').parent('li').within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.wait(1000);
    cy.contains('Projekt Cypress', {timeout: 6000}).should('not.exist');
  });
});

describe('Usuwanie projektu przez UI', () => {
  it('Dodaje i usuwa projekt, test na zielono jeśli projekt znika z listy', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();

    // Dodaj projekt
    cy.contains('label', 'Nazwa:').parent().find('input').type('Projekt Do Usunięcia');
    cy.contains('label', 'Opis:').parent().find('textarea').type('Opis do usunięcia');
    cy.get('button').contains('Zapisz').click();
    cy.wait(1000);
    cy.get('li').contains('Projekt Do Usunięcia').should('exist');

    // Poczekaj 2 sekundy i usuń projekt
    cy.wait(2000);
    cy.get('li').contains('Projekt Do Usunięcia').parent('li').within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.contains('Projekt Do Usunięcia', {timeout: 6000}).should('not.exist');
  });
});

describe('Dodawanie i usuwanie historyjki w projekcie', () => {
  it('Dodaje historyjkę do projektu, usuwa ją i projekt', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();

    // Dodaj projekt
    cy.contains('label', 'Nazwa:').parent().find('input').type('Projekt Testowy E2E');
    cy.contains('label', 'Opis:').parent().find('textarea').type('Opis testowego projektu');
    cy.get('button').contains('Zapisz').click();
    cy.wait(1000);
    cy.contains('Projekt Testowy E2E').should('exist');

    // Wybierz projekt
    cy.get('li').contains('Projekt Testowy E2E').parent('li').within(() => {
      cy.get('button').contains('Wybierz projekt').click();
    });

    // Dodaj historyjkę
    cy.contains('h2', 'Dodaj nową historyjkę').should('be.visible')
      .closest('form').within(() => {
        cy.get('input').first().type('Historyjka E2E');
        cy.get('textarea').first().type('Opis historyjki E2E');
        cy.get('button').contains('Dodaj historyjkę').click();
      });
    cy.contains('Historyjka E2E').should('exist');

    // Usuń historyjkę
    cy.contains('Historyjka E2E').parent().within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.contains('Historyjka E2E', {timeout: 6000}).should('not.exist');

    // Usuń projekt
    cy.get('li').contains('Projekt Testowy E2E').parent('li').within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.contains('Projekt Testowy E2E', {timeout: 6000}).should('not.exist');
  });
});

describe('Dodawanie i usuwanie zadania w projekcie', () => {
  it('Dodaje zadanie do historyjki, usuwa je i projekt', () => {
    cy.visit('http://localhost:5173');
    cy.get('input.form-control').eq(0).type('dev');
    cy.get('input.form-control').eq(1).type('dev');
    cy.get('button').contains('Zaloguj').click();

    // Dodaj projekt
    cy.contains('label', 'Nazwa:').parent().find('input').type('Projekt Zadanie E2E');
    cy.contains('label', 'Opis:').parent().find('textarea').type('Opis projektu do testu zadania');
    cy.get('button').contains('Zapisz').click();
    cy.wait(1000);
    cy.contains('Projekt Zadanie E2E').should('exist');

    // Wybierz projekt
    cy.get('li').contains('Projekt Zadanie E2E').parent('li').within(() => {
      cy.get('button').contains('Wybierz projekt').click();
    });

    // Dodaj historyjkę
    cy.contains('h2', 'Dodaj nową historyjkę').should('be.visible')
      .closest('form').within(() => {
        cy.get('input').first().type('Historyjka Zadanie E2E');
        cy.get('textarea').first().type('Opis historyjki do testu zadania');
        cy.get('button').contains('Dodaj historyjkę').click();
      });
    cy.contains('Historyjka Zadanie E2E').should('exist');

    // Dodaj zadanie
    cy.contains('Historyjka Zadanie E2E').parent().within(() => {
      cy.contains('h3', 'Dodaj zadanie').should('be.visible')
        .closest('form').within(() => {
          cy.get('input').eq(0).type('Zadanie E2E');
          cy.get('input').eq(1).type('Opis zadania E2E');
          cy.get('button').contains('Dodaj zadanie').click();
        });
    });
    cy.contains('Zadanie E2E').should('exist');

    // Usuń zadanie
    cy.contains('Zadanie E2E').parents('div').first().within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.contains('Zadanie E2E', {timeout: 6000}).should('not.exist');

    // Usuń projekt
    cy.get('li').contains('Projekt Zadanie E2E').parent('li').within(() => {
      cy.get('button').contains('Usuń').click({force: true});
    });
    cy.contains('Projekt Zadanie E2E', {timeout: 6000}).should('not.exist');
  });
});
