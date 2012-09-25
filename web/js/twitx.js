$(function() {

	function TwitxStreamViewModel() {
					var self = this;
					var eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');

					self.messages = ko.observableArray([
						 {msg:"Hello from Twit.x Land!"},
						 {msg:"I'm not sure what I'm doing here..."},
						 {msg:"Wheels-down SFO!"}
					]);

					self.twitxBox = ko.observable("Here's my message...");

					self.twitxIt = function() {
									self.messages.unshift({msg:self.twitxBox()});
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
									self.fetchUserProfile(self.username());
								} else {
								alert(reply.status);				
									alert('invalid login');
								}
							});
						}
					}

				self.profile = ko.observable(new Profile());	

					self.fetchUserProfile = function() {
									if (self.username().trim() != '') {
													eb.send('vertx.mongopersistor', {action:'findone', collection:'profiles', matcher: {username:self.username()}}, function(reply) {
																	if (reply.status === 'ok') {
																		self.profile(new Profile(reply.result));	
																	}})}};
																				

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
