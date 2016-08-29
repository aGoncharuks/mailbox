module.exports = {
  templateUrl: 'html/mailbox.html',
  controller: ['mailboxService', '$state', function(mailboxService, $state) {
   this.inboxLettersCount = mailboxService.inboxLetters.length;
   this.outboxLettersCount = mailboxService.outboxLetters.length;
   this.usersCount = mailboxService.users.length;
   this.stateIncludesInbox = () => $state.includes('mailbox.inbox');
   this.stateIncludesOutbox = () => $state.includes('mailbox.outbox');
  }]
};
