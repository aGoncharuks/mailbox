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
