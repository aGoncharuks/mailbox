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
