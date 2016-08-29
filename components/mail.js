module.exports = {
  bindings: {
    mail: "<"
   },
  templateUrl: 'html/mail.html',
  controller: ['$scope', '$state', 'mailboxService', function($scope, $state, mailboxService) {
    this.parentStateUrl = $state.$current.parent.self.url;
  }]
};
