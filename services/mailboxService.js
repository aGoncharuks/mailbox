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
