module.exports = ($stateProvider, $urlRouterProvider) => {

 //states
 $urlRouterProvider.otherwise('/inbox/mails');

 $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>',
    controller: function(authorizationService) {

      var credentials = firebase.database().ref().child('credentials');
      credentials.once('value').then( (snapshot) => {
        authorizationService.login = snapshot.val().login.toString();
        authorizationService.password = snapshot.val().password.toString();
      });
    }

 });
 $stateProvider.state('mailbox', {
   abstract: true,
   url: '/',
   template: "<mailbox></mailbox>",
   resolve: {
     mailboxes: function(mailboxService) {
       return mailboxService.getAllRecords('mailboxes');
     },
     letters: function(mailboxService) {
       return mailboxService.getAllRecords('letters');
     },
     users: function(mailboxService) {
       return mailboxService.getAllRecords('users');
     }
   },
   controller: function($scope, mailboxes, letters, users, mailboxService) {
     mailboxService.inboxID = mailboxes.filter( (mailbox) => mailbox.title === 'inbox')[0]._id;
     mailboxService.outboxID = mailboxes.filter( (mailbox) => mailbox.title === 'outbox')[0]._id;
     mailboxService.inboxLetters = letters.filter( (letter) => letter.mailbox === mailboxService.inboxID);
     mailboxService.outboxLetters = letters.filter( (letter) => letter.mailbox === mailboxService.outboxID);
     mailboxService.users = users;
   }
 });
 $stateProvider.state('mailbox.contacts', {
   url: 'contacts',
   template: "<contacts></contacts>"
 });
 $stateProvider.state('mailbox.inbox', {
   url: 'inbox',
   template: "<inbox></inbox>"
 });
 $stateProvider.state('mailbox.outbox', {
   url: 'outbox',
   template: "<outbox></outbox>"
 });
 $stateProvider.state('mailbox.inbox.mails', {
   url: '/mails',
   template: "<mails></mails>"
 });
 $stateProvider.state('mailbox.outbox.mails', {
   url: '/mails',
   template: "<mails></mails>"
 });
 $stateProvider.state('mailbox.newletter', {
   url: 'newletter',
   template: "<new-letter></new-letter>"
 });
 $stateProvider.state('mailbox.inbox.letter', {
   url: '/:letterID',
   template: "<letter letter='letter'></letter>",
   resolve: {
     letterId: function($stateParams) {
       return $stateParams.letterId;
     }
   },
   controller: function($scope, $state, $stateParams, mailboxService, letterId) {
     $scope.letter = mailboxService[$state.$current.parent.self.url + 'Letters'].filter( (letter) => letter._id === $stateParams.letterID)[0]
   }
 });
 $stateProvider.state('mailbox.outbox.letter', {
   url: '/:letterID',
   template: "<letter letter='letter'></letter>",
   resolve: {
     letter: function($state, mailboxService, $stateParams, letters) {
       return mailboxService[$state.$current.parent.self.url + 'Letters'].filter( (letter) => letter._id === $stateParams.letterID)[0];
     }
   },
   controller: function($scope, letter) {
     $scope.letter = letter;
   }
 });
};
