 var app = angular.module('gmailForPoor', ['ui.router', 'firebase']);

 app.config(require('./config'));

 app.run(require('./run'));

 //services
 app.service('mailboxService', require('../services/mailboxService'));

 app.service('authorizationService', require('../services/authorizationService') );

 //components
 app.component('login', require('../components/login'));

 app.component('mailbox', require('../components/mailbox'));

 app.component('inbox', require('../components/inbox'));

 app.component('outbox', require('../components/outbox'));

 app.component('mails', require('../components/mails'));

 app.component('mail', require('../components/mail'));

 app.component('letter', require('../components/letter'));

 app.component('contacts', require('../components/contacts'));

 app.component('newContact', require('../components/newcontact'));

 app.component('newLetter', require('../components/newLetter'));
