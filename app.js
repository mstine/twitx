load('vertx.js');

var webServerConf = {  
	port: 8080,
	host: 'localhost'
};

vertx.deployModule('vertx.web-server-v1.0', webServerConf);

