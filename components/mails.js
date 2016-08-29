module.exports = {
  templateUrl: 'html/mails.html',
  controller: ['$state', 'mailboxService', function($state, mailboxService) {
    this.mails = mailboxService[$state.$current.parent.self.url + "Letters"];
  }]
 }
