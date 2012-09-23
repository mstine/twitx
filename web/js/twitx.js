$(function() {

	function TwitxStreamViewModel() {
					var self = this;

					self.messages = ko.observableArray([
						 {msg:"Hello from Twit.x Land!"},
						 {msg:"I'm not sure what I'm doing here..."},
						 {msg:"Wheels-down SFO!"}
					]);

					self.twitxBox = ko.observable("Here's my message...");

					self.twitxIt = function() {
									self.messages.unshift({msg:self.twitxBox()});
					}
	};	

	ko.applyBindings(new TwitxStreamViewModel());

});
