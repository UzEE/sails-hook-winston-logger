# Sails Winston Logger
A custom Sails.js hook to add support for logging using the popular Winston library. Currently, the module comes with out of the box support for the following trasports:

* Console (will automatically be activated by default)
* DailyRotateFile (based on Winston's [DailyRotateFile](https://github.com/winstonjs/winston/blob/master/docs/transports.md#dailyrotatefile-transport))
* AWS CloudWatch (based on LazyWithClass's [Winston CloudWatch](https://github.com/lazywithclass/winston-cloudwatch))

## Installation
Make sure you have at least Sails.js version v0.11.0 installed.

```ssh
npm install sails-hook-winston-logger --save
```

## Usage
Like all other Sails.js hooks, this module will be instantiaed automatically when the Sails server lifts. It will configure Sails' default [Captain's Log](https://github.com/balderdashy/captains-log) to use a custom logger.

You can control what logging transports are available.