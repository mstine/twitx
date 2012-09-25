load('vertx.js');

var webServerConf = {  
	port: 8080,
	host: 'localhost',
	bridge: true,
	inbound_permitted: [
		{
					address: 'vertx.basicauthmanager.login'
	  },
		{
						address: 'vertx.mongopersistor'
		}
	]
};

vertx.deployModule('vertx.web-server-v1.0', webServerConf);

var mongoConf = {
				db_name: 'twitx'
}

vertx.deployModule('vertx.mongo-persistor-v1.0', mongoConf);

var securityConf = {
				user_collection: 'profiles'
};

vertx.deployModule('vertx.auth-mgr-v1.0', securityConf);

