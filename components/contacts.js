module.exports = {
   templateUrl: 'html/contacts.html',
   controller: ['mailboxService', function(mailboxService) {
     this.users = mailboxService.users;
   }]
}
