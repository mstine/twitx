load('vertx.js');

// Web Server Configuration
var webServerConf = {  
	port: 8080,
	host: 'localhost',
	bridge: true,
	inbound_permitted: [
    { address: 'vertx.basicauthmanager.login' },
    { address: 'vertx.mongopersistor' },
    { address: 'messages.incoming' },
    { address: 'messages.primestream' },
  ],
  outbound_permitted: [
    { address_re: 'messages.outgoing\\..+' }
]};

// Deploy Web Server Module
vertx.deployModule('vertx.web-server-v1.0', webServerConf);

// MongoDB Persistor Configuration
var mongoConf = {
  db_name: 'twitx'
}

// Deploy MongoDB Persistor Module
vertx.deployModule('vertx.mongo-persistor-v1.1', mongoConf);

// Authentication Manager Configuration
var securityConf = {
  user_collection: 'profiles'
};

// Deploy Authentication Manager Module
vertx.deployModule('vertx.auth-mgr-v1.0', securityConf);

var eb = vertx.eventBus;

// Handle incoming messages from the browser...
var messageHandler = function(message) {
  message.timestamp = new Date();
  eb.send('vertx.mongopersistor', { action: 'save',
          collection: 'messages',
          document: message });

  eb.send('vertx.mongopersistor', { action : 'find',
          collection: 'profiles',
          matcher: { following: message.username }
  },
  function (reply) {
    // This should really be on a worker...refactor!
    for (var i = 0; i < reply.results.length; i++) {
      // Stream the message to each person that's following me...
      eb.publish('messages.outgoing.'+reply.results[i].username, message);
    }
    // Send the message to me as well...
    eb.publish('messages.outgoing.'+message.username, message);
  });
}
eb.registerHandler('messages.incoming', messageHandler);

function loadUserProfile(username, callback) {
  eb.send('vertx.mongopersistor', 
          { action: 'findone',
            collection: 'profiles',
            matcher: { username: username } 
          }, 
          callback);
}

// Prime the message stream after loading user profiles...
eb.registerHandler('messages.primestream', function(message, replier) {
  loadUserProfile(message.username, function(reply) {
    if (reply.status === 'ok') {
      eb.send('vertx.mongopersistor', 
              { action: 'find',
                collection: 'messages',
                matcher: { 
                  username: { "$in": reply.result.following } 
                },
                sort: {timestamp: -1},
                limit: 10 }, 
                function(queryReply) {
                  eb.publish('messages.outgoing.'+reply.result.username, queryReply)
                });
                replier(reply);
    }
  });
});


