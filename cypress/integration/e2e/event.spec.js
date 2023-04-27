Cypress.Commands.add('iframeLoaded', { prevSubject: 'element' }, ($iframe) => {
  const contentWindow = $iframe.prop('contentWindow');
  return new Promise((resolve) => {
    if (contentWindow && contentWindow.document.readyState === 'complete') {
      resolve(contentWindow);
    } else {
      $iframe.on('load', () => {
        resolve(contentWindow);
      });
    }
  });
});

Cypress.Commands.add('getInDocument', { prevSubject: 'document' }, (document, selector) =>
  Cypress.$(selector, document)
);

Cypress.Commands.add('getWithinIframe', (targetElement) =>
  cy.get('iframe').iframeLoaded().its('document').getInDocument(targetElement)
);

describe('event', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });

  it('login', () => {
    cy.visit('/sign_in');
    cy.get('[data-testid=loginForm]').setEmail('squalla2020@outlook.com').setPassword('123456789');
    cy.get('[data-testid=btnLogin]').click();
    cy.wait(5000);
    cy.visit('/');
  });

  it('switch character', () => {
    cy.wait(5000);
    cy.get('[data-testid=nav-btn]').click();
    cy.get('[data-testid=character-menu').should('be.visible');
    cy.get('[data-testid=character-menu] ul div .MuiLink-root').eq(0).click();
  });

  context('browse events after login', () => {
    it('navigate to list events page', () => {
      cy.visit('/events');
      cy.url().should('contain', '/events');
    });

    it('will load all events, my events and previous events', () => {
      cy.wait(5000);
      cy.get('[data-testid=btn-acceptCookies]').click();
      cy.get('[data-testid=grid-eventsActive]').should('be.visible');
      cy.get('[data-testid=grid-eventsPrev]').should('be.visible');
      cy.get('[data-testid=tab-eventsOwned]').click();
      cy.get('[data-testid=grid-eventsOwned]').should('be.visible');
      cy.get('[data-testid=btn-createEvent]').should('be.visible');
    });
  });

  context('create event', () => {
    it('navigate to create event page', () => {
      cy.get('[data-testid=btn-createEvent]').click();
      cy.url().should('contain', '/events/new');
    });

    it('will load event form', () => {
      cy.wait(10000);
      cy.get('[data-testid=createEventForm]').should('be.visible');
    });

    it('will include all fields', () => {
      cy.get('[data-testid=createEventFieldTitle]').should('be.visible');
      cy.get('[data-testid=createEventFieldSubtitle]').should('be.visible');
      cy.get('[data-testid=createEventFieldLocation]').should('be.visible');
      cy.get('[data-testid=createEventFieldDescription]').should('be.visible');
      cy.get('[data-testid=createEventFieldFrom]').should('be.visible');
      cy.get('[data-testid=createEventFieldTo]').should('be.visible');
      cy.get('[data-testid=createEventFieldCoverImage]').should('be.visible');
      cy.get('[data-testid=createEventFieldAudio]').should('be.visible');
      cy.get('[data-testid=createEventFieldCapacity]').should('be.visible');
      cy.get('[data-testid=createEventFieldPrice]').should('be.visible');
      cy.get('[data-testid=createEventFieldExperiences]').should('be.visible');
      cy.get('[data-testid=createEventFieldProducers]').should('be.visible');
      cy.get('[data-testid=createEventFormSubmitBtn]').should('be.visible');
    });

    it('producers field will contain current character', () => {
      cy.get('[data-testid=producerCard]').should('be.visible');
    });

    it('validation check', () => {
      cy.get('[data-testid=createEventFormSubmitBtn]').click();
      cy.get('[data-testid=createEventFieldTitle] .Mui-error').should('be.visible');
      cy.get('[data-testid=createEventFieldSubtitle] .Mui-error').should('be.visible');
      cy.get('[data-testid=createEventFieldCoverImage] .Mui-error').should('be.visible');
      cy.get('[data-testid=createEventFieldDescription] .Mui-error').should('be.visible');
      cy.get('[data-testid=createEventFieldLocation] .Mui-error').should('be.visible');
      cy.get('[data-testid=createEventFieldCapacity] .Mui-error').should('be.visible');
      cy.get('[data-testid=createEventFieldExperiences] .Mui-error').should('be.visible');
    });

    it('will create new event', () => {
      cy.get('[data-testid=createEventFieldTitle]').type('Test Event Title');
      cy.get('[data-testid=createEventFieldSubtitle]').type('Test Event Subtitle');

      cy.setTinyMceContent(
        'mention-tinymce-editor',
        'Iaculis sociis tristique nunc, molestie ridiculus feugiat non. Et cursus tellus non, egestas aliquet fringilla sed molestie. Venenatis massa enim mattis pellentesque elit id enim viverra.'
      );

      cy.get('[data-testid=createEventFieldLocation]').type('Tomsk{downarrow}{enter}');
      cy.wait(1000);
      cy.get('[data-testid=createEventFieldLocation]').type('{downarrow}{enter}');

      cy.get('[data-testid=createEventFieldCoverImage]').within(() => {
        cy.get('.btn-browse').click();
      });
      cy.wait(15000);
      cy.get('.tam-assetmanager-container').should('be.visible');
      cy.get('.tam-assetmanager-container .tam-asset.tam-asset--file').eq(10).click();

      cy.get('[data-testid=createEventFieldFrom] button').click();
      cy.get('button.MuiPickersDay-current').should('be.visible');
      cy.get('button.MuiPickersDay-current').click();

      cy.get('[data-testid=createEventFieldTo] button').click();
      cy.get('button.MuiPickersCalendarHeader-iconButton').eq(1).click();
      cy.get('button.MuiPickersDay-day').eq(20).should('be.visible');
      cy.get('button.MuiPickersDay-day').eq(20).click();

      cy.get('[data-testid=createEventFieldCapacity] input').type('100');
      cy.get('[data-testid=createEventFieldPrice] input').type('50');

      cy.get('[data-testid=createEventFieldExperiences] input')
        .focus()
        .type('{uparrow}{uparrow}{uparrow}')
        .type('{enter}');

      cy.get('[data-testid=createEventFieldProducers] input').focus().type('Happy dream{uparrow}');
      cy.wait(2000);
      cy.get('[data-testid=createEventFieldProducers] input').type('{uparrow}{enter}');

      cy.get('[data-testid=createEventFormSubmitBtn]').should('be.visible').click();

      cy.url().should(
        'match',
        /\/events\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });

  context('show details of event', () => {
    it('will show details of event', () => {
      cy.wait(2000);
      cy.get('[data-testid=eventDetailTitle]').should('be.visible');
      cy.get('[data-testid=eventDetailSubtitle]').should('be.visible');
      cy.get('[data-testid=eventDetailFrom]').should('be.visible');
      cy.get('[data-testid=eventDetailTo]').should('be.visible');
      cy.get('[data-testid=eventDetailDescription]').should('be.visible');
      cy.get('[data-testid=eventDetailPrice]').should('be.visible');
      cy.get('[data-testid=eventDetailStatus]').should('be.visible');
      cy.get('[data-testid=eventDetailProducers]').should('be.visible');
      cy.get('[data-testid=eventDetailParticipants]').should('be.visible');
      cy.get('[data-testid=eventDetailExperiences]').should('be.visible');
      cy.get('[data-testid=eventDetailLocation]').should('be.visible');
      cy.get('[data-testid=eventDetailRelevants]').should('be.visible');
      cy.get('[data-testid=editEventBtn]').should('be.visible');
    });
  });

  context('edit event', () => {
    it('navigate to edit event page', () => {
      cy.get('[data-testid=editEventBtn]').click();
      cy.url().should('contain', '/events/edit/');
    });

    it('will load event form', () => {
      cy.wait(10000);
      cy.get('[data-testid=updateEventForm]').should('be.visible');
    });

    it('will include all fields', () => {
      cy.get('[data-testid=updateEventFieldTitle]').should('be.visible');
      cy.get('[data-testid=updateEventFieldSubtitle]').should('be.visible');
      cy.get('[data-testid=updateEventFieldLocation]').should('be.visible');
      cy.get('[data-testid=updateEventFieldDescription]').should('be.visible');
      cy.get('[data-testid=updateEventFieldFrom]').should('be.visible');
      cy.get('[data-testid=updateEventFieldTo]').should('be.visible');
      cy.get('[data-testid=updateEventFieldCoverImage]').should('be.visible');
      cy.get('[data-testid=updateEventFieldAudio]').should('be.visible');
      cy.get('[data-testid=updateEventFieldCapacity]').should('be.visible');
      cy.get('[data-testid=updateEventFieldPrice]').should('be.visible');
      cy.get('[data-testid=updateEventFieldExperiences]').should('be.visible');
      cy.get('[data-testid=updateEventFieldProducers]').should('be.visible');
      cy.get('[data-testid=updateEventFormSubmitBtn]').should('be.visible');
    });

    it('will edit event', () => {
      cy.get('[data-testid=updateEventFieldTitle]').type(' Edited');
      cy.get('[data-testid=updateEventFieldSubtitle]').type(' Edited');

      cy.setTinyMceContent(
        'mention-tinymce-editor',
        'Iaculis sociis tristique nunc, molestie ridiculus feugiat non. Et cursus tellus non, egestas aliquet fringilla sed molestie. Venenatis massa enim mattis pellentesque elit id enim viverra. Edited'
      );

      cy.get('[data-testid=updateEventFieldLocation]').type(
        '{selectall}{del}Moscow{downarrow}{enter}'
      );
      cy.wait(2000);
      cy.get('[data-testid=updateEventFieldLocation]').type('{downarrow}{enter}');

      cy.get('[data-testid=updateEventFieldCoverImage]').within(() => {
        cy.get('.btn-browse').click();
      });
      cy.wait(15000);
      cy.get('.tam-assetmanager-container').should('be.visible');
      cy.get('.tam-assetmanager-container .tam-asset.tam-asset--file').eq(12).click();

      cy.get('[data-testid=updateEventFieldFrom] button').click();
      cy.get('button.MuiPickersDay-current').should('be.visible');
      cy.get('button.MuiPickersDay-current').click();

      cy.get('[data-testid=updateEventFieldTo] button').click();
      cy.get('button.MuiPickersCalendarHeader-iconButton').eq(1).click();
      cy.get('button.MuiPickersCalendarHeader-iconButton').eq(1).click();
      cy.get('button.MuiPickersDay-day').eq(20).should('be.visible');
      cy.get('button.MuiPickersDay-day').eq(20).click();

      cy.get('[data-testid=updateEventFieldCapacity] input').type('100');
      cy.get('[data-testid=updateEventFieldPrice] input').type('100');

      cy.get('[data-testid=updateEventFieldExperiences] input')
        .focus()
        .type('{uparrow}{uparrow}{uparrow}{uparrow}{uparrow}')
        .type('{enter}');

      cy.get('[data-testid=updateEventFieldProducers] input').focus().type('The parrot{uparrow}');
      cy.wait(1000);
      cy.get('[data-testid=updateEventFieldProducers] input').type('{uparrow}{enter}');

      cy.get('[data-testid=updateEventFormSubmitBtn]').should('be.visible').click();

      cy.url().should(
        'match',
        /\/events\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });

  /*context('book event', () => {
    it('navigate to book event page', () => {
      cy.get('[data-testid=eventDetailBookBtn]').should('be.visible').click();
      cy.url().should(
        'match',
        /\/events\/book\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    it('will load book form', () => {
      cy.wait(10000);
      cy.get('[data-testid=eventBookForm]').should('be.visible');
    });

    it('will include all fields', () => {
      cy.get('[data-testid=eventBookBillingName]').should('be.visible');
      cy.get('[data-testid=eventBookBillingAddress]').should('be.visible');
      cy.get('[data-testid=eventBookBillingCity]').should('be.visible');
      cy.get('[data-testid=eventBookBillingPostcode]').should('be.visible');
      cy.get('[data-testid=eventBookBillingCountry]').should('be.visible');
      cy.get('[data-testid=eventBookBillingCardHolder]').should('be.visible');
      cy.get('[data-testid=eventBookBillingCardNumber]').should('be.visible');
      cy.get('[data-testid=eventBookBillingCardExpiry]').should('be.visible');
      cy.get('[data-testid=eventBookBillingCardCVC]').should('be.visible');
      cy.get('[data-testid=eventBookBillingPolicy]').should('be.visible');
      cy.get('[data-testid=eventBookBillingSubmit]').should('be.visible');
    });

    it('will book event', () => {
      cy.get('[data-testid=eventBookBillingName]').type('Roman Rutchin');
      cy.get('[data-testid=eventBookBillingAddress]').type('Seversk, Tomsk Oblast');
      cy.get('[data-testid=eventBookBillingCity]').type('Tomsk');
      cy.get('[data-testid=eventBookBillingPostcode]').type('634050');

      cy.get('[data-testid=eventBookBillingCountry]').type('Russia');
      cy.wait(2000);
      cy.get('[data-testid=eventBookBillingCountry]').type('{downarrow}{enter}');

      cy.get('[data-testid=eventBookBillingCardHolder]').type('Roman Rutchin');

      cy.get('[data-testid=eventBookBillingCardNumber] iframe')
        .iframeLoaded()
        .its('document')
        .getInDocument('.Input.InputElement[name=cardnumber]')
        .type('4242424242424242');

      cy.get('[data-testid=eventBookBillingCardExpiry] iframe')
        .iframeLoaded()
        .its('document')
        .getInDocument('.Input.InputElement[name=exp-date]')
        .type('1223');

      cy.get('[data-testid=eventBookBillingCardCVC] iframe')
        .iframeLoaded()
        .its('document')
        .getInDocument('.Input.InputElement[name=cvc]')
        .type('234');

      cy.get('[data-testid=eventBookBillingPolicy]').click();
      cy.get('[data-testid=eventBookBillingSubmit]').click();
    });

    it('will navigate to invoice page', () => {
      cy.url().should('contain', '/events/book/success/');
      cy.wait(5000);
      cy.get('[data-testid=eventBookSuccessDownload]').should('be.visible');
    });
  });*/

  context('delete event', () => {
    it('navigate to edit event page', () => {
      cy.wait(5000);
      cy.get('[data-testid=editEventBtn]').click();
      cy.url().should('contain', '/events/edit/');
      cy.wait(5000);
    });

    it('will show confirm dialog', () => {
      cy.get('[data-testid=deleteEventBtn]').should('be.visible').click();
      cy.get('[data-testid=deleteEventConfirmDlg]').should('be.visible');
      cy.wait(1000);
    });

    it('will delete event', () => {
      cy.get('[data-testid=deleteEventConfirmBtn]').should('be.visible').click();
      cy.wait(5000);
      cy.url().should('match', /\/events$/);
    });
  });
});
