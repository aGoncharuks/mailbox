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
