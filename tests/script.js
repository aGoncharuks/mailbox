(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../components/contacts":4,"../components/inbox":5,"../components/letter":6,"../components/login":7,"../components/mail":8,"../components/mailbox":9,"../components/mails":10,"../components/newLetter":11,"../components/newcontact":12,"../components/outbox":13,"../services/authorizationService":14,"../services/mailboxService":15,"./config":2,"./run":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports = ($rootScope, authorizationService, $state) => {

  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
    if(toState.name !== 'login' && !authorizationService.isLoggedIn){
       event.preventDefault();
       $state.go('login');
     }
   });

  //  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
  //    console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
  //  });
  //
  //  $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
  //    console.log('$stateChangeError - fired when an error occurs during transition.');
  //    console.log(arguments);
  //  });
  //
  //  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
  //    console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
  //  });
  //
  //  $rootScope.$on('$viewContentLoaded',function(event){
  //    console.log('$viewContentLoaded - fired after dom rendered',event);
  //  });
  //
  //  $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
  //    console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
  //    console.log(unfoundState, fromState, fromParams);
  //  });
};

},{}],4:[function(require,module,exports){
module.exports = {
   templateUrl: 'html/contacts.html',
   controller: ['mailboxService', function(mailboxService) {
     this.users = mailboxService.users;
   }]
}

},{}],5:[function(require,module,exports){
module.exports = {
  abstract: true,
  templateUrl: 'html/inbox.html'
};

},{}],6:[function(require,module,exports){
module.exports =  {
  bindings: {
    letter: "<"
  },
  templateUrl: 'html/letter.html'
};

},{}],7:[function(require,module,exports){
module.exports = {
  templateUrl: 'html/login.html',
  controller: function($state, $scope, authorizationService) {
    this.submit = () => {
      if(!$scope.loginForm.$valid) {
        return;
      }
      if(authorizationService.checkCredentials(this.login, this.password)){
        $state.go('mailbox.inbox.mails');
      } else {
        alert('Wrong credentials');
      }
    };
  }
};

},{}],8:[function(require,module,exports){
module.exports = {
  bindings: {
    mail: "<"
   },
  templateUrl: 'html/mail.html',
  controller: ['$scope', '$state', 'mailboxService', function($scope, $state, mailboxService) {
    this.parentStateUrl = $state.$current.parent.self.url;
  }]
};

},{}],9:[function(require,module,exports){
module.exports = {
  templateUrl: 'html/mailbox.html',
  controller: ['mailboxService', '$state', function(mailboxService, $state) {
   this.stateIncludesInbox = () => $state.includes('mailbox.inbox');
   this.stateIncludesOutbox = () => $state.includes('mailbox.outbox');
  }]
};

},{}],10:[function(require,module,exports){
module.exports = {
  templateUrl: 'html/mails.html',
  controller: ['$state', 'mailboxService', function($state, mailboxService) {
    this.mails = mailboxService[$state.$current.parent.self.url + "Letters"];
  }]
 }

},{}],11:[function(require,module,exports){
module.exports = {
   templateUrl: 'html/newletter.html',
   controller: ['$scope', '$state', 'mailboxService',  function($scope, $state, mailboxService) {
     this.newLetter = {
       mailbox: mailboxService.outboxID
     };
     this.addLetter = function() {
       if($scope.newLetterForm.$valid) {
         mailboxService.addRecord('letters', this.newLetter).then((response) => {
           mailboxService.outboxLetters.push(response.data);
           $state.go('mailbox.outbox.mails');
         }, (error) => {
           console.log(error)
         });
       }
     }

   }]
}

},{}],12:[function(require,module,exports){
module.exports = {
  bindings: {
    showNewContactForm: "=",
    users: "="
  },
   templateUrl: 'html/newcontact.html',
   controller: ['$scope', 'mailboxService', function($scope, mailboxService) {
     this.newUser = {};
     this.addUser = function() {
       if($scope.newUserForm.$valid) {
         mailboxService.addRecord('users', this.newUser).then( (response) => {
           mailboxService.users.push(response.data);
         }, (error) => {
           console.log(error)
         });
         this.showNewContactForm = false;
       }
     }
   }]
};

},{}],13:[function(require,module,exports){
module.exports = {
  abstract: true,
  templateUrl: 'html/outbox.html'
}

},{}],14:[function(require,module,exports){
module.exports = function() {

  this.checkCredentials = (login, password) => {
    if (login.toString() === this.login && password.toString() === this.password) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    return this.isLoggedIn;
  }
}

},{}],15:[function(require,module,exports){
module.exports = function($http, $q) {

  this.name = 'agoncharuks';
  this.baseUrl = `https://test-api.javascript.ru/v1/${this.name}/`;
  this.inboxID = '579e1b716baa8d7d1bfe6350';

  this.getAllRecords = (collectionName) => {
    return $http.get(this.baseUrl + collectionName).then( (response) => response.data);
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
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwiYXBwL2NvbmZpZy5qcyIsImFwcC9ydW4uanMiLCJjb21wb25lbnRzL2NvbnRhY3RzLmpzIiwiY29tcG9uZW50cy9pbmJveC5qcyIsImNvbXBvbmVudHMvbGV0dGVyLmpzIiwiY29tcG9uZW50cy9sb2dpbi5qcyIsImNvbXBvbmVudHMvbWFpbC5qcyIsImNvbXBvbmVudHMvbWFpbGJveC5qcyIsImNvbXBvbmVudHMvbWFpbHMuanMiLCJjb21wb25lbnRzL25ld0xldHRlci5qcyIsImNvbXBvbmVudHMvbmV3Y29udGFjdC5qcyIsImNvbXBvbmVudHMvb3V0Ym94LmpzIiwic2VydmljZXMvYXV0aG9yaXphdGlvblNlcnZpY2UuanMiLCJzZXJ2aWNlcy9tYWlsYm94U2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2dtYWlsRm9yUG9vcicsIFsndWkucm91dGVyJywgJ2ZpcmViYXNlJ10pO1xuXG4gYXBwLmNvbmZpZyhyZXF1aXJlKCcuL2NvbmZpZycpKTtcblxuIGFwcC5ydW4ocmVxdWlyZSgnLi9ydW4nKSk7XG5cbiAvL3NlcnZpY2VzXG4gYXBwLnNlcnZpY2UoJ21haWxib3hTZXJ2aWNlJywgcmVxdWlyZSgnLi4vc2VydmljZXMvbWFpbGJveFNlcnZpY2UnKSk7XG5cbiBhcHAuc2VydmljZSgnYXV0aG9yaXphdGlvblNlcnZpY2UnLCByZXF1aXJlKCcuLi9zZXJ2aWNlcy9hdXRob3JpemF0aW9uU2VydmljZScpICk7XG5cbiAvL2NvbXBvbmVudHNcbiBhcHAuY29tcG9uZW50KCdsb2dpbicsIHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvbG9naW4nKSk7XG5cbiBhcHAuY29tcG9uZW50KCdtYWlsYm94JywgcmVxdWlyZSgnLi4vY29tcG9uZW50cy9tYWlsYm94JykpO1xuXG4gYXBwLmNvbXBvbmVudCgnaW5ib3gnLCByZXF1aXJlKCcuLi9jb21wb25lbnRzL2luYm94JykpO1xuXG4gYXBwLmNvbXBvbmVudCgnb3V0Ym94JywgcmVxdWlyZSgnLi4vY29tcG9uZW50cy9vdXRib3gnKSk7XG5cbiBhcHAuY29tcG9uZW50KCdtYWlscycsIHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvbWFpbHMnKSk7XG5cbiBhcHAuY29tcG9uZW50KCdtYWlsJywgcmVxdWlyZSgnLi4vY29tcG9uZW50cy9tYWlsJykpO1xuXG4gYXBwLmNvbXBvbmVudCgnbGV0dGVyJywgcmVxdWlyZSgnLi4vY29tcG9uZW50cy9sZXR0ZXInKSk7XG5cbiBhcHAuY29tcG9uZW50KCdjb250YWN0cycsIHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvY29udGFjdHMnKSk7XG5cbiBhcHAuY29tcG9uZW50KCduZXdDb250YWN0JywgcmVxdWlyZSgnLi4vY29tcG9uZW50cy9uZXdjb250YWN0JykpO1xuXG4gYXBwLmNvbXBvbmVudCgnbmV3TGV0dGVyJywgcmVxdWlyZSgnLi4vY29tcG9uZW50cy9uZXdMZXR0ZXInKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XHJcblxyXG4gLy9zdGF0ZXNcclxuICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9pbmJveC9tYWlscycpO1xyXG5cclxuICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcclxuICAgIHVybDogJy9sb2dpbicsXHJcbiAgICB0ZW1wbGF0ZTogJzxsb2dpbj48L2xvZ2luPicsXHJcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbihhdXRob3JpemF0aW9uU2VydmljZSkge1xyXG5cclxuICAgICAgdmFyIGNyZWRlbnRpYWxzID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKS5jaGlsZCgnY3JlZGVudGlhbHMnKTtcclxuICAgICAgY3JlZGVudGlhbHMub25jZSgndmFsdWUnKS50aGVuKCAoc25hcHNob3QpID0+IHtcclxuICAgICAgICBhdXRob3JpemF0aW9uU2VydmljZS5sb2dpbiA9IHNuYXBzaG90LnZhbCgpLmxvZ2luLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgYXV0aG9yaXphdGlvblNlcnZpY2UucGFzc3dvcmQgPSBzbmFwc2hvdC52YWwoKS5wYXNzd29yZC50b1N0cmluZygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiB9KTtcclxuICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWlsYm94Jywge1xyXG4gICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgdXJsOiAnLycsXHJcbiAgIHRlbXBsYXRlOiBcIjxtYWlsYm94PjwvbWFpbGJveD5cIixcclxuICAgcmVzb2x2ZToge1xyXG4gICAgIG1haWxib3hlczogZnVuY3Rpb24obWFpbGJveFNlcnZpY2UpIHtcclxuICAgICAgIHJldHVybiBtYWlsYm94U2VydmljZS5nZXRBbGxSZWNvcmRzKCdtYWlsYm94ZXMnKTtcclxuICAgICB9LFxyXG4gICAgIGxldHRlcnM6IGZ1bmN0aW9uKG1haWxib3hTZXJ2aWNlKSB7XHJcbiAgICAgICByZXR1cm4gbWFpbGJveFNlcnZpY2UuZ2V0QWxsUmVjb3JkcygnbGV0dGVycycpO1xyXG4gICAgIH0sXHJcbiAgICAgdXNlcnM6IGZ1bmN0aW9uKG1haWxib3hTZXJ2aWNlKSB7XHJcbiAgICAgICByZXR1cm4gbWFpbGJveFNlcnZpY2UuZ2V0QWxsUmVjb3JkcygndXNlcnMnKTtcclxuICAgICB9XHJcbiAgIH0sXHJcbiAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgbWFpbGJveGVzLCBsZXR0ZXJzLCB1c2VycywgbWFpbGJveFNlcnZpY2UpIHtcclxuICAgICBtYWlsYm94U2VydmljZS5pbmJveElEID0gbWFpbGJveGVzLmZpbHRlciggKG1haWxib3gpID0+IG1haWxib3gudGl0bGUgPT09ICdpbmJveCcpWzBdLl9pZDtcclxuICAgICBtYWlsYm94U2VydmljZS5vdXRib3hJRCA9IG1haWxib3hlcy5maWx0ZXIoIChtYWlsYm94KSA9PiBtYWlsYm94LnRpdGxlID09PSAnb3V0Ym94JylbMF0uX2lkO1xyXG4gICAgIG1haWxib3hTZXJ2aWNlLmluYm94TGV0dGVycyA9IGxldHRlcnMuZmlsdGVyKCAobGV0dGVyKSA9PiBsZXR0ZXIubWFpbGJveCA9PT0gbWFpbGJveFNlcnZpY2UuaW5ib3hJRCk7XHJcbiAgICAgbWFpbGJveFNlcnZpY2Uub3V0Ym94TGV0dGVycyA9IGxldHRlcnMuZmlsdGVyKCAobGV0dGVyKSA9PiBsZXR0ZXIubWFpbGJveCA9PT0gbWFpbGJveFNlcnZpY2Uub3V0Ym94SUQpO1xyXG4gICAgIG1haWxib3hTZXJ2aWNlLnVzZXJzID0gdXNlcnM7XHJcbiAgIH1cclxuIH0pO1xyXG4gJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haWxib3guY29udGFjdHMnLCB7XHJcbiAgIHVybDogJ2NvbnRhY3RzJyxcclxuICAgdGVtcGxhdGU6IFwiPGNvbnRhY3RzPjwvY29udGFjdHM+XCJcclxuIH0pO1xyXG4gJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haWxib3guaW5ib3gnLCB7XHJcbiAgIHVybDogJ2luYm94JyxcclxuICAgdGVtcGxhdGU6IFwiPGluYm94PjwvaW5ib3g+XCJcclxuIH0pO1xyXG4gJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haWxib3gub3V0Ym94Jywge1xyXG4gICB1cmw6ICdvdXRib3gnLFxyXG4gICB0ZW1wbGF0ZTogXCI8b3V0Ym94Pjwvb3V0Ym94PlwiXHJcbiB9KTtcclxuICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWlsYm94LmluYm94Lm1haWxzJywge1xyXG4gICB1cmw6ICcvbWFpbHMnLFxyXG4gICB0ZW1wbGF0ZTogXCI8bWFpbHM+PC9tYWlscz5cIlxyXG4gfSk7XHJcbiAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFpbGJveC5vdXRib3gubWFpbHMnLCB7XHJcbiAgIHVybDogJy9tYWlscycsXHJcbiAgIHRlbXBsYXRlOiBcIjxtYWlscz48L21haWxzPlwiXHJcbiB9KTtcclxuICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWlsYm94Lm5ld2xldHRlcicsIHtcclxuICAgdXJsOiAnbmV3bGV0dGVyJyxcclxuICAgdGVtcGxhdGU6IFwiPG5ldy1sZXR0ZXI+PC9uZXctbGV0dGVyPlwiXHJcbiB9KTtcclxuICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWlsYm94LmluYm94LmxldHRlcicsIHtcclxuICAgdXJsOiAnLzpsZXR0ZXJJRCcsXHJcbiAgIHRlbXBsYXRlOiBcIjxsZXR0ZXIgbGV0dGVyPSdsZXR0ZXInPjwvbGV0dGVyPlwiLFxyXG4gICByZXNvbHZlOiB7XHJcbiAgICAgbGV0dGVySWQ6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xyXG4gICAgICAgcmV0dXJuICRzdGF0ZVBhcmFtcy5sZXR0ZXJJZDtcclxuICAgICB9XHJcbiAgIH0sXHJcbiAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIG1haWxib3hTZXJ2aWNlLCBsZXR0ZXJJZCkge1xyXG4gICAgICRzY29wZS5sZXR0ZXIgPSBtYWlsYm94U2VydmljZVskc3RhdGUuJGN1cnJlbnQucGFyZW50LnNlbGYudXJsICsgJ0xldHRlcnMnXS5maWx0ZXIoIChsZXR0ZXIpID0+IGxldHRlci5faWQgPT09ICRzdGF0ZVBhcmFtcy5sZXR0ZXJJRClbMF1cclxuICAgfVxyXG4gfSk7XHJcbiAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFpbGJveC5vdXRib3gubGV0dGVyJywge1xyXG4gICB1cmw6ICcvOmxldHRlcklEJyxcclxuICAgdGVtcGxhdGU6IFwiPGxldHRlciBsZXR0ZXI9J2xldHRlcic+PC9sZXR0ZXI+XCIsXHJcbiAgIHJlc29sdmU6IHtcclxuICAgICBsZXR0ZXI6IGZ1bmN0aW9uKCRzdGF0ZSwgbWFpbGJveFNlcnZpY2UsICRzdGF0ZVBhcmFtcywgbGV0dGVycykge1xyXG4gICAgICAgcmV0dXJuIG1haWxib3hTZXJ2aWNlWyRzdGF0ZS4kY3VycmVudC5wYXJlbnQuc2VsZi51cmwgKyAnTGV0dGVycyddLmZpbHRlciggKGxldHRlcikgPT4gbGV0dGVyLl9pZCA9PT0gJHN0YXRlUGFyYW1zLmxldHRlcklEKVswXTtcclxuICAgICB9XHJcbiAgIH0sXHJcbiAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgbGV0dGVyKSB7XHJcbiAgICAgJHNjb3BlLmxldHRlciA9IGxldHRlcjtcclxuICAgfVxyXG4gfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKCRyb290U2NvcGUsIGF1dGhvcml6YXRpb25TZXJ2aWNlLCAkc3RhdGUpID0+IHtcclxuXHJcbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JyxmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgaWYodG9TdGF0ZS5uYW1lICE9PSAnbG9naW4nICYmICFhdXRob3JpemF0aW9uU2VydmljZS5pc0xvZ2dlZEluKXtcclxuICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgfVxyXG4gICB9KTtcclxuXHJcbiAgLy8gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xyXG4gIC8vICAgIGNvbnNvbGUubG9nKCckc3RhdGVDaGFuZ2VTdGFydCB0byAnK3RvU3RhdGUudG8rJy0gZmlyZWQgd2hlbiB0aGUgdHJhbnNpdGlvbiBiZWdpbnMuIHRvU3RhdGUsdG9QYXJhbXMgOiBcXG4nLHRvU3RhdGUsIHRvUGFyYW1zKTtcclxuICAvLyAgfSk7XHJcbiAgLy9cclxuICAvLyAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJyxmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XHJcbiAgLy8gICAgY29uc29sZS5sb2coJyRzdGF0ZUNoYW5nZUVycm9yIC0gZmlyZWQgd2hlbiBhbiBlcnJvciBvY2N1cnMgZHVyaW5nIHRyYW5zaXRpb24uJyk7XHJcbiAgLy8gICAgY29uc29sZS5sb2coYXJndW1lbnRzKTtcclxuICAvLyAgfSk7XHJcbiAgLy9cclxuICAvLyAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKXtcclxuICAvLyAgICBjb25zb2xlLmxvZygnJHN0YXRlQ2hhbmdlU3VjY2VzcyB0byAnK3RvU3RhdGUubmFtZSsnLSBmaXJlZCBvbmNlIHRoZSBzdGF0ZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlLicpO1xyXG4gIC8vICB9KTtcclxuICAvL1xyXG4gIC8vICAkcm9vdFNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGVkJyxmdW5jdGlvbihldmVudCl7XHJcbiAgLy8gICAgY29uc29sZS5sb2coJyR2aWV3Q29udGVudExvYWRlZCAtIGZpcmVkIGFmdGVyIGRvbSByZW5kZXJlZCcsZXZlbnQpO1xyXG4gIC8vICB9KTtcclxuICAvL1xyXG4gIC8vICAkcm9vdFNjb3BlLiRvbignJHN0YXRlTm90Rm91bmQnLGZ1bmN0aW9uKGV2ZW50LCB1bmZvdW5kU3RhdGUsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XHJcbiAgLy8gICAgY29uc29sZS5sb2coJyRzdGF0ZU5vdEZvdW5kICcrdW5mb3VuZFN0YXRlLnRvKycgIC0gZmlyZWQgd2hlbiBhIHN0YXRlIGNhbm5vdCBiZSBmb3VuZCBieSBpdHMgbmFtZS4nKTtcclxuICAvLyAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyk7XHJcbiAgLy8gIH0pO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgdGVtcGxhdGVVcmw6ICdodG1sL2NvbnRhY3RzLmh0bWwnLFxyXG4gICBjb250cm9sbGVyOiBbJ21haWxib3hTZXJ2aWNlJywgZnVuY3Rpb24obWFpbGJveFNlcnZpY2UpIHtcclxuICAgICB0aGlzLnVzZXJzID0gbWFpbGJveFNlcnZpY2UudXNlcnM7XHJcbiAgIH1dXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgdGVtcGxhdGVVcmw6ICdodG1sL2luYm94Lmh0bWwnXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gIHtcclxuICBiaW5kaW5nczoge1xyXG4gICAgbGV0dGVyOiBcIjxcIlxyXG4gIH0sXHJcbiAgdGVtcGxhdGVVcmw6ICdodG1sL2xldHRlci5odG1sJ1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICB0ZW1wbGF0ZVVybDogJ2h0bWwvbG9naW4uaHRtbCcsXHJcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oJHN0YXRlLCAkc2NvcGUsIGF1dGhvcml6YXRpb25TZXJ2aWNlKSB7XHJcbiAgICB0aGlzLnN1Ym1pdCA9ICgpID0+IHtcclxuICAgICAgaWYoISRzY29wZS5sb2dpbkZvcm0uJHZhbGlkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGF1dGhvcml6YXRpb25TZXJ2aWNlLmNoZWNrQ3JlZGVudGlhbHModGhpcy5sb2dpbiwgdGhpcy5wYXNzd29yZCkpe1xyXG4gICAgICAgICRzdGF0ZS5nbygnbWFpbGJveC5pbmJveC5tYWlscycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdXcm9uZyBjcmVkZW50aWFscycpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgYmluZGluZ3M6IHtcclxuICAgIG1haWw6IFwiPFwiXHJcbiAgIH0sXHJcbiAgdGVtcGxhdGVVcmw6ICdodG1sL21haWwuaHRtbCcsXHJcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJHN0YXRlJywgJ21haWxib3hTZXJ2aWNlJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIG1haWxib3hTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLnBhcmVudFN0YXRlVXJsID0gJHN0YXRlLiRjdXJyZW50LnBhcmVudC5zZWxmLnVybDtcclxuICB9XVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICB0ZW1wbGF0ZVVybDogJ2h0bWwvbWFpbGJveC5odG1sJyxcclxuICBjb250cm9sbGVyOiBbJ21haWxib3hTZXJ2aWNlJywgJyRzdGF0ZScsIGZ1bmN0aW9uKG1haWxib3hTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgdGhpcy5zdGF0ZUluY2x1ZGVzSW5ib3ggPSAoKSA9PiAkc3RhdGUuaW5jbHVkZXMoJ21haWxib3guaW5ib3gnKTtcclxuICAgdGhpcy5zdGF0ZUluY2x1ZGVzT3V0Ym94ID0gKCkgPT4gJHN0YXRlLmluY2x1ZGVzKCdtYWlsYm94Lm91dGJveCcpO1xyXG4gIH1dXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHRlbXBsYXRlVXJsOiAnaHRtbC9tYWlscy5odG1sJyxcclxuICBjb250cm9sbGVyOiBbJyRzdGF0ZScsICdtYWlsYm94U2VydmljZScsIGZ1bmN0aW9uKCRzdGF0ZSwgbWFpbGJveFNlcnZpY2UpIHtcclxuICAgIHRoaXMubWFpbHMgPSBtYWlsYm94U2VydmljZVskc3RhdGUuJGN1cnJlbnQucGFyZW50LnNlbGYudXJsICsgXCJMZXR0ZXJzXCJdO1xyXG4gIH1dXHJcbiB9XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICB0ZW1wbGF0ZVVybDogJ2h0bWwvbmV3bGV0dGVyLmh0bWwnLFxyXG4gICBjb250cm9sbGVyOiBbJyRzY29wZScsICckc3RhdGUnLCAnbWFpbGJveFNlcnZpY2UnLCAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIG1haWxib3hTZXJ2aWNlKSB7XHJcbiAgICAgdGhpcy5uZXdMZXR0ZXIgPSB7XHJcbiAgICAgICBtYWlsYm94OiBtYWlsYm94U2VydmljZS5vdXRib3hJRFxyXG4gICAgIH07XHJcbiAgICAgdGhpcy5hZGRMZXR0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgIGlmKCRzY29wZS5uZXdMZXR0ZXJGb3JtLiR2YWxpZCkge1xyXG4gICAgICAgICBtYWlsYm94U2VydmljZS5hZGRSZWNvcmQoJ2xldHRlcnMnLCB0aGlzLm5ld0xldHRlcikudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICBtYWlsYm94U2VydmljZS5vdXRib3hMZXR0ZXJzLnB1c2gocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgJHN0YXRlLmdvKCdtYWlsYm94Lm91dGJveC5tYWlscycpO1xyXG4gICAgICAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgfVxyXG5cclxuICAgfV1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBiaW5kaW5nczoge1xyXG4gICAgc2hvd05ld0NvbnRhY3RGb3JtOiBcIj1cIixcclxuICAgIHVzZXJzOiBcIj1cIlxyXG4gIH0sXHJcbiAgIHRlbXBsYXRlVXJsOiAnaHRtbC9uZXdjb250YWN0Lmh0bWwnLFxyXG4gICBjb250cm9sbGVyOiBbJyRzY29wZScsICdtYWlsYm94U2VydmljZScsIGZ1bmN0aW9uKCRzY29wZSwgbWFpbGJveFNlcnZpY2UpIHtcclxuICAgICB0aGlzLm5ld1VzZXIgPSB7fTtcclxuICAgICB0aGlzLmFkZFVzZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgIGlmKCRzY29wZS5uZXdVc2VyRm9ybS4kdmFsaWQpIHtcclxuICAgICAgICAgbWFpbGJveFNlcnZpY2UuYWRkUmVjb3JkKCd1c2VycycsIHRoaXMubmV3VXNlcikudGhlbiggKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgbWFpbGJveFNlcnZpY2UudXNlcnMucHVzaChyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgIH0pO1xyXG4gICAgICAgICB0aGlzLnNob3dOZXdDb250YWN0Rm9ybSA9IGZhbHNlO1xyXG4gICAgICAgfVxyXG4gICAgIH1cclxuICAgfV1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgdGVtcGxhdGVVcmw6ICdodG1sL291dGJveC5odG1sJ1xyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gIHRoaXMuY2hlY2tDcmVkZW50aWFscyA9IChsb2dpbiwgcGFzc3dvcmQpID0+IHtcclxuICAgIGlmIChsb2dpbi50b1N0cmluZygpID09PSB0aGlzLmxvZ2luICYmIHBhc3N3b3JkLnRvU3RyaW5nKCkgPT09IHRoaXMucGFzc3dvcmQpIHtcclxuICAgICAgdGhpcy5pc0xvZ2dlZEluID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNMb2dnZWRJbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaXNMb2dnZWRJbjtcclxuICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaHR0cCwgJHEpIHtcclxuXHJcbiAgdGhpcy5uYW1lID0gJ2Fnb25jaGFydWtzJztcclxuICB0aGlzLmJhc2VVcmwgPSBgaHR0cHM6Ly90ZXN0LWFwaS5qYXZhc2NyaXB0LnJ1L3YxLyR7dGhpcy5uYW1lfS9gO1xyXG4gIHRoaXMuaW5ib3hJRCA9ICc1NzllMWI3MTZiYWE4ZDdkMWJmZTYzNTAnO1xyXG5cclxuICB0aGlzLmdldEFsbFJlY29yZHMgPSAoY29sbGVjdGlvbk5hbWUpID0+IHtcclxuICAgIHJldHVybiAkaHR0cC5nZXQodGhpcy5iYXNlVXJsICsgY29sbGVjdGlvbk5hbWUpLnRoZW4oIChyZXNwb25zZSkgPT4gcmVzcG9uc2UuZGF0YSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmFkZFJlY29yZCA9IChjb2xsZWN0aW9uTmFtZSwgcmVjb3JkKSA9PiB7XHJcbiAgICByZXR1cm4gJGh0dHAucG9zdCh0aGlzLmJhc2VVcmwgKyBjb2xsZWN0aW9uTmFtZSwgcmVjb3JkKTtcclxuICB9XHJcblxyXG4gIHRoaXMuY2hhbmdlUmVjb3JkID0gKGNvbGxlY3Rpb25OYW1lLCByZWNvcmRJRCwgcmVjb3JkKSA9PiB7XHJcbiAgICByZXR1cm4gJGh0dHAucGF0Y2godGhpcy5iYXNlVXJsICsgY29sbGVjdGlvbk5hbWUgKycvJyArIHJlY29yZElELCByZWNvcmQpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5kZWxldGVSZWNvcmQgPSAoY29sbGVjdGlvbk5hbWUsIHJlY29yZElEKSA9PiB7XHJcbiAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHRoaXMuYmFzZVVybCArIGNvbGxlY3Rpb25OYW1lICsnLycgKyByZWNvcmRJRCk7XHJcbiAgfVxyXG59O1xyXG4iXX0=
