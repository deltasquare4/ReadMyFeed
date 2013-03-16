var path = require('path');

var config = module.exports = require('nconf');

config
	.argv()
	.env()
	.defaults({
		'NODE_ENV': 'development',
		'site': {
			'hostname': 'localhost',
			'port': 3000
		}
	});

var env = config.get('NODE_ENV');

var configPath = path.join(__dirname, 'server.' + env + '.json');

config
	.file({ file: configPath });
