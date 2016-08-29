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
