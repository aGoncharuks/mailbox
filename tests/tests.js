describe('gmailForPoor', () => {

  beforeEach(module('gmailForPoor'));

  //service test
  describe('mailboxService', () => {
    var $httpBackend;
    var mailboxService;
    var mockMailboxes = [
      {
        "_id":"id1",
        "title":"inbox"
      },
      {
        "_id":"id2",
        "title":"outbox"
      }
    ];

    beforeEach(inject((_$httpBackend_, _mailboxService_) => {

      mailboxService =  _mailboxService_;
      $httpBackend = _$httpBackend_;

      $httpBackend.whenGET('https://test-api.javascript.ru/v1/agoncharuks/mailboxes').respond(mockMailboxes);
    }));

    it('Should return array with inbox and outbox elements', (done) => {
      mailboxService.getAllRecords('mailboxes').then((mailboxes) => {

        //checks if response data type is Array
        expect(Object.prototype.toString.call(mailboxes)).toBe('[object Array]');

        //checks if Array consists of 2 elements(inbox and outbox)
        expect(mailboxes.length).toBe(2);

        //checks if Array's first element's title is "inbox"
        expect(mailboxes[0].title).toBe('inbox');

        //checks if Array's second element's title is "outbox"
        expect(mailboxes[1].title).toBe('outbox');

        done();
      });
      $httpBackend.flush();
    });

  });


  //component test
  describe('newLetterComponent', () => {

    var componentCtrl;
    var mailboxService;

    beforeEach(inject(($componentController, _mailboxService_) => {

      mailboxService =  _mailboxService_;
      componentCtrl = $componentController('newLetter');
      mailboxService.outboxID = 'id1';
    }));

    it('newLetter object exists and has property "mailbox"', () => {
      //checks if newLetter exists and is object
      expect(typeof componentCtrl.newLetter === "object").toBe(true);

      //checks if newLetter object has property mailbox
      expect(componentCtrl.newLetter.hasOwnProperty('mailbox')).toBe(true);
    });

  });

  //component test 2
  // describe('newLetterComponent', () => {
  //
  //   var componentCtrl;
  //   var mailboxService;
  //   var $scope;
  //   var element;
  //   var newLetterMock = {
  //     "_id": "id1",
  //     "to": "mail",
  //     "subject": "some text",
  //     "body": "some text",
  //     "mailbox":"id"
  //   }
  //
  //   beforeEach(inject(($q, $componentController, $rootScope, $compile, _mailboxService_) => {
  //
  //     //creating component scope, because component method requires $scope.newLetterForm.$valid check
  //     $scope = $rootScope.$new();
  //     element = angular.element('<new-letter></new-letter>');
  //     element = $compile(element)($scope);
  //     $scope.newLetterForm = {};
  //     $scope.newLetterForm.$valid = true;
  //     $scope.$digest();
  //
  //     mailboxService =  _mailboxService_;
  //     var deferred = $q.defer();
  //     spyOn(mailboxService, 'addRecord').and.returnValue(deferred.promise);
  //     deferred.resolve(newLetterMock);
  //     componentCtrl = $componentController('newLetter');
  //   }));
  //
  //   it('Should call addRecord method and return new letter', () => {
  //     componentCtrl.addLetter().then((newLetter) => {
  //
  //       //checks if component addRecord method was called
  //       expect(componentCtrl.addLetter).toHaveBeenCalled();
  //     });
  //   });
  //
  // });

});
