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
	pkgJSON = require(path.resolve('package.json'));

module.exports = function winstonLogger(sails) {

	var _transportsAvailable = {

		console: Winston.transports.Console,
		dailyRotate: Winston.transports.DailyRotateFile,
		cloudWatch: WinstonCloudWatch,
	};

	return {

		defaults: {
			winston: {

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
					json: false,
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

		initialize: function (cb) {

			sails.after(['hook:logger:loaded'], function () {

				var transports = [],
					_transportsAvailableArray = Object.keys(_transportsAvailable);

				var addTransport = function (transport, config) {

					if (!config.enabled) {
						return;
					}

					delete config.enabled;

					transports.push(new transport(config));
				};

				for (var key in sails.config.winston) {

					if (_transportsAvailableArray.indexOf(key) >= 0) {
						addTransport(_transportsAvailable[key], sails.config.winston[key]);
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
