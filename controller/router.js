'use strict';

const Joi = require('joi');
const moment = require('moment');

const createTrial = require('./handler/create-trial');
const createPatient = require('./handler/create-patient');
const dashboardPresenter = require('./handler/dashboard');
const trialPresenter = require('./handler/trial');
const patientPresenter = require('./handler/patient');
const patientCSV = require('./handler/patient-csv');
const surveyPresenter = require('./handler/survey');
const minimumNameLength = 3;
const minimumIrbLength = 4;

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: dashboardPresenter
    },
    {
        method: 'GET',
        path: '/vendor/{param*}',
        handler: {
            directory: {
                path: 'bower_components'
            }
        }
    },
    {
        method: 'GET',
        path: '/static/style/{param*}',
        handler: {
            directory: {
                path: 'view/stylesheet'
            }
        }
    },
    {
        method: 'GET',
        path: '/static/script/{param*}',
        handler: {
            directory: {
                path: 'view/script'
            }
        }
    },
    {
        method: 'POST',
        path: '/trial',
        handler: createTrial,
        config: {
            validate: {
                payload: {
                    name: Joi
                        .string()
                        .min(minimumNameLength),
                    description: Joi
                        .string(),
                    IRBID: Joi
                        .string()
                        .min(minimumIrbLength),
                    IRBStart: Joi
                        .date()
                        .format('YYYY-MM-DD')
                        .min(moment().startOf('day').toDate()),
                    IRBEnd: Joi
                        .date()
                        .format('YYYY-MM-DD')
                        .min(Joi.ref('IRBStart')),
                    targetCount: Joi
                        .number()
                        .integer()
                        .positive(),
                    stagecount: Joi
                        .number()
                        .integer()
                        .positive(),
                    stageName: Joi
                        .string()
                        .regex(/^[\w ]+(,[\w ]+)*$/, 'comma separated list')
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/trial/{id}',
        handler: trialPresenter,
        config: {
            validate: {
                params: {
                    id: Joi
                        .number()
                        .integer()
                        .positive()
                },
                query: {
                    fromDate: Joi
                       .date()
                       .format('YYYY-MM-DD'),
                    toDate: Joi
                       .date()
                       .format('YYYY-MM-DD')
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/patient',
        handler: createPatient,
        config: {
            validate: {
                payload: {
                    stageId: Joi
                        .number()
                        .integer()
                        .positive(),
                    trialId: Joi
                        .number()
                        .integer()
                        .positive(),
                    startDate: Joi
                        .date()
                        .format('YYYY-MM-DD')
                        .min(moment().startOf('day').toDate()),
                    endDate: Joi
                        .date()
                        .format('YYYY-MM-DD')
                        .min(Joi.ref('startDate'))
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/patient/{pin}',
        handler: patientPresenter,
        config: {
            validate: {
                params: {
                    pin: Joi
                        .number()
                        .integer()
                        .positive()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/patient/{pin}.csv',
        handler: patientCSV,
        config: {
            validate: {
                params: {
                    pin: Joi
                        .number()
                        .integer()
                        .positive()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/survey/{id}',
        handler: surveyPresenter,
        config: {
            validate: {
                params: {
                    id: Joi
                        .number()
                        .integer()
                        .positive()
                }
            }
        }
    }
];
