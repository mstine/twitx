$(function() {

	function TwitxStreamViewModel() {
					var self = this;
					var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

					self.messages = ko.observableArray();

					self.twitxBox = ko.observable();

					self.twitxIt = function() {
            eb.send('messages.incoming', { username: self.profile().username,
                    message:self.twitxBox() });
            self.twitxBox('');  
					}

					self.username = ko.observable('');
					self.password = ko.observable('');
					self.sessionID = ko.observable('');

					self.authenticated = ko.computed(function() {
									return self.sessionID() != '';
					});

					self.showLoginForm = ko.computed(function() {
									return !self.authenticated();
					});

					self.login = function() {
            if (self.username().trim() != '' && self.password().trim() != '') {
              eb.send('vertx.basicauthmanager.login', {username: self.username(), password: self.password()}, function (reply) {
                if (reply.status === 'ok') {
                  self.sessionID(reply.sessionID);
                  self.primeMessageStream(self.username());

                  eb.registerHandler('messages.outgoing.'+self.username(), function(message) {
                    // If this is a result of prime, will be a JSON object w/ results array
                    if ($.isArray(message.results)) {
                      self.messages.unshift.apply(self.messages, message.results);
                    // Otherwise it is a plain message
                    } else {
                      self.messages.unshift(message);
                    }
                  });
                } else {
                  alert('Invalid Username/Password. Please try again.');
                }
              });
            }
          }

				self.profile = ko.observable(new Profile());	

        self.primeMessageStream = function(username) {
          if (username.trim() != '') {
            eb.send('messages.primestream', { username: username }, 
                    function(reply) {
                      if (reply.status === 'ok') {
                        self.profile(new Profile(reply.result));	
                      }
                    });
          } 
        };

        function Profile(json) {
          if (json) {
            var that = this;

            that._id = json._id;
            that.username = json.username;
            that.password = json.password;
            that.email = json.email;
            that.fullName = json.fullname;
          }
        }

  };	

	ko.applyBindings(new TwitxStreamViewModel());

});
