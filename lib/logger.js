/**
 * sails-hook-winston-logger
 *
 * Author: Uzair Sajid <uzair@uzairsajid.com>
 * License: MIT
 *
 * A Sails.js hook for integrating Winston logging into the system.
**/

var Winston = require('winston'),
	WinstonCloudWatch = require('winston-cloudwatch'),
	path = require('path'),
	fs = require('fs'),
	pkgJSON = require(path.resolve('package.json')),
	mkdirp = require('mkdirp'),
	_ = require('lodash');

module.exports = function winstonLogger(sails) {

	var _transportsAvailable = {

		console: Winston.transports.Console,
		dailyRotate: Winston.transports.DailyRotateFile,
		cloudWatch: WinstonCloudWatch,
	};

	var _configurationKey = null;

	return {

		defaults: {
			__configKey__: {

				console: {
					enabled: true,
					level: 'info',
					timestamp: true,
					colorize: true,
					prettyPrint: true
				},

				dailyRotate: {
					enabled: false,
					level: 'info',
					filename: path.join(path.dirname(path.resolve('package.json')), 'logs', pkgJSON.name + '.log.'),
					timestamp: true,
					colorize: false,
					maxsize: 1024 * 1024 * 10,
					json: true,
					prettyPrint: true,
					depth: 10,
					tailable: true,
					zippedArchive: true,
					datePattern: 'yyyy-MM-dd'
				},

				cloudWatch: {
					enabled: false,
					logGroupName: null,
					logStreamName: null,
					awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
					awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
					awsRegion: process.env.AWS_REGION
				}
			}
		},

		configure: function() {

			_configurationKey = this.configKey;

			for (var key in sails.config[this.configKey]) {
				sails.config[this.configKey][key] = _.extend(this.defaults[this.configKey][key], sails.config[this.configKey][key]);
			}
		},

		initialize: function (cb) {

			sails.log.info(sails.config[_configurationKey]);

			sails.after(['hook:logger:loaded'], function () {

				var transports = [],
					_transportsAvailableArray = Object.keys(_transportsAvailable);

				var addTransport = function (transport, config) {

					if (!config.enabled) {
						return;
					}

					delete config.enabled;

					if (transport === Winston.transports.DailyRotateFile || transport === Winston.transports.File) {

						var dir = path.dirname(config.filename);

						if (!fs.existsSync(dir)) {
							mkdirp.sync(dir);
						}
					}

					transports.push(new transport(config));
				};

				for (var key in sails.config[_configurationKey]) {

					if (_transportsAvailableArray.indexOf(key) >= 0) {
						addTransport(_transportsAvailable[key], sails.config[_configurationKey][key]);
					}
				}

				var logger = new Winston.Logger({
					transports: transports
				});

				var CaptainsLog = require(path.resolve('node_modules/sails/node_modules/captains-log'));
				sails.log = new CaptainsLog({ custom: logger });

				sails.log.info('Using Winston as the default logger');

				return cb();
			});
		}
	};
};
