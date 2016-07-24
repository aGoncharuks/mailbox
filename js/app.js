var app = angular.module('gmailForPoor', []);

app.component('mailbox', {
  templateUrl: 'mailbox.html',
  controller: function() {
    this.mails = [{
      author: "eileen.barlow@gmail.com",
      subject: "about work",
      content: "Son read such next see the rest two. Was use extent old entire sussex. Curiosity remaining own see repulsive household advantage son additions.",
      date: "01/07/2016"
    }, {
      author: "neilbeesley@gmail.com",
      subject: "are you coming?",
      content: "Her old collecting she considered discovered. So at parties he warrant oh staying. Square new horses and put better end. Sincerity collected happiness do is contented.",
      date: "01/07/2016"
    }, {
      author: "graham.bell@gmail.com",
      subject: "question again",
      content: "Throwing consider dwelling bachelor joy her proposal laughter. Raptures returned disposed one entirely her men ham. By to admire vanity county an mutual as roused.",
      date: "01/07/2016"
    }, {
      author: "peter.birch@gmail.com",
      subject: "hate you brother",
      content: "Dependent certainty off discovery him his tolerably offending. Ham for attention remainder sometimes additions recommend fat our.",
      date: "01/07/2016"
    }, {
      author: "stuart.bryan@gmail.com",
      subject: "regarding Peter",
      content: "Consider now provided laughter boy landlord dashwood. Often voice and the spoke. No shewing fertile village equally prepare up females as an.",
      date: "01/07/2016"
    }];
    this.hideElement = require('./hideElement');
  }
});

app.component('mail', {
  bindings: {
    mail: "<"
  },
  templateUrl: 'mail.html'
});
