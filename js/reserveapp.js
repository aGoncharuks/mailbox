 var app = angular.module('gmailForPoor', ['ui.router']);

 app.config( ($stateProvider, $urlRouterProvider) => {

  //states
  $urlRouterProvider.otherwise('/inbox/mails');

  $stateProvider.state('login', {
               url: '/login',
               template: '<login></login>'
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
      mailboxService.inboxID = mailboxes.filter(mailbox => mailbox.title === 'inbox')[0]._id;
      mailboxService.outboxID = mailboxes.filter(mailbox => mailbox.title === 'outbox')[0]._id;
      mailboxService.inboxLetters = letters.filter(letter => letter.mailbox === mailboxService.inboxID);
      mailboxService.outboxLetters = letters.filter(letter => letter.mailbox === mailboxService.outboxID);
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
    template: "<newletter></newletter>"
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
      $scope.letter = mailboxService[$state.$current.parent.self.url + 'Letters'].filter(letter => letter._id === $stateParams.letterID)[0]
    }
  });
  $stateProvider.state('mailbox.outbox.letter', {
    url: '/:letterID',
    template: "<letter letter='letter'></letter>",
    resolve: {
      letter: function($state, mailboxService, $stateParams, letters) {
        return mailboxService[$state.$current.parent.self.url + 'Letters'].filter(letter => letter._id === $stateParams.letterID)[0];
      }
    },
    controller: function($scope, letter) {
      $scope.letter = letter;
    }
  });
 });

 app.run(($rootScope, authorizationService, $state) => {

   $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
     if(toState.name !== 'login' && !authorizationService.isLoggedIn){
        event.preventDefault();
        $state.go('login');
      }
    });
 });

 //services
 app.service('mailboxService', function($http, $q) {

   this.name = 'agoncharuks';
   this.baseUrl = `https://test-api.javascript.ru/v1/${this.name}/`;
   this.inboxID = '579e1b716baa8d7d1bfe6350';

   this.getAllRecords = (collectionName) => {
     return $http.get(this.baseUrl + collectionName)
               .then(response => response.data);
   }

   this.addRecord = (collectionName, record) => {
     return $http.post(this.baseUrl + collectionName, record);
   }

   this.changeRecord = (collectionName, recordID, record) => {
     return $http.patch(this.baseUrl + collectionName +'/' + recordID, record);
   }

   this.deleteRecord = (collectionName, recordID) => {
     return $http.delete(this.baseUrl + collectionName +'/' + recordID);
   }
 });

 app.service('authorizationService', function($http, $q) {
   this.baseUrl = `https://test-api.javascript.ru/v1/${this.name}/`;
   this.login = 'test@domen.com';
   this.password = '123456';

   this.checkCredentials = (login, password) => {
     if (login === this.login && password === this.password) {
       this.isLoggedIn = true;
     } else {
       this.isLoggedIn = false;
     }
   }
 });

 //components
 app.component('login', {
   templateUrl: 'login.html',
   controller: ['$state', 'authorizationService', function($state, authorizationService) {
     this.submit = () => {
       if(this.login.toString() === authorizationService.login && this.password.toString() === authorizationService.password) {
         $state.go('mailbox.inbox.mails');
       } else {
         alert('Wrong credentials');
       }
     };
   }]
 });

 app.component('mailbox', {
   templateUrl: 'mailbox.html',
   controller: ['mailboxService', '$state', function(mailboxService, $state) {
    this.inboxLettersCount = mailboxService.inboxLetters.length;
    this.outboxLettersCount = mailboxService.outboxLetters.length;
    this.usersCount = mailboxService.users.length;
    this.stateIncludesInbox = () => $state.includes('mailbox.inbox');
    this.stateIncludesOutbox = () => $state.includes('mailbox.outbox');
    // this.hideElement = require('./hideElement');
   }]
 });

 app.component('inbox', {
   abstract: true,
   templateUrl: 'inbox.html'
 });

 app.component('outbox', {
   abstract: true,
   templateUrl: 'outbox.html'
 });

 app.component('mails', {
   templateUrl: 'mails.html',
   controller: ['$state', 'mailboxService', function($state, mailboxService) {
     this.mails = mailboxService[$state.$current.parent.self.url + "Letters"];
   }]
  });

 app.component('mail', {
   bindings: {
     mail: "<"
    },
   templateUrl: 'mail.html',
   controller: ['$scope', '$state', 'mailboxService', function($scope, $state, mailboxService) {
     this.parentStateUrl = $state.$current.parent.self.url;
   }]
 });

 app.component('letter', {
   bindings: {
     letter: "<"
   },
   templateUrl: 'letter.html'
 });

 app.component('contacts', {
    templateUrl: 'contacts.html',
    controller: ['mailboxService', function(mailboxService) {
      this.users = mailboxService.users;
    }]
 });

 app.component('newcontact', {
   bindings: {
     showNewContactForm: "=",
     users: "="
   },
    templateUrl: 'newcontact.html',
    controller: ['$scope', 'mailboxService', function($scope, mailboxService) {
      this.newUser = {};
      this.addUser = function() {
        if($scope.newUserForm.$valid) {
          mailboxService.addRecord('users', this.newUser).then(data => {
            this.users.push(this.newUser);
          }, error => {
            console.log(error)
          });
          this.showNewContactForm = false;
        }
      }
    }]
 });

 app.component('newletter', {
    templateUrl: 'newletter.html',
    controller: ['$scope', 'mailboxService', function($scope, mailboxService) {
      this.newLetter = {
        mailbox: mailboxService.outboxID
      };
      this.addLetter = function() {
        if($scope.newLetterForm.$valid) {
          mailboxService.addRecord('letters', this.newLetter).then(data => {
            mailboxService.outboxLetters.push(this.newLetter);
          }, error => {
            console.log(error)
          });
        }
      }

    }]
 });
