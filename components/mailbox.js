module.exports = {
  templateUrl: 'html/mailbox.html',
  controller: ['mailboxService', '$state', function(mailboxService, $state) {
   this.stateIncludesInbox = () => $state.includes('mailbox.inbox');
   this.stateIncludesOutbox = () => $state.includes('mailbox.outbox');
  }]
};
