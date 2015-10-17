'use strict';

/**
 * @module presenter/trial
 */

const moment = require('moment');

const database = require('../model');

/**
 * A dashboard with an overview of a specific trial.
 * @function trial
 * @param {Request} request - Hapi request
 * @param {Reply} reply - Hapi Reply
 * @returns {View} Rendered page
 */
module.exports = function (request, reply) {
    const trial = database.sequelize.model('trial');

    trial.findById(request.params.id).then(function (currentTrial) {
        if (currentTrial === null) {
            reply.redirect('/404');
        } else {
            reply.view('trial', {
                title: 'Pain Reporting Portal',
                trial: processTrial(currentTrial),
                graphData: JSON.stringify([
                    {
                        value: 100,
                        color: '#2ECC40',
                        label: 'Compliant'
                    },
                    {
                        value: 50,
                        color: '#FFDC00',
                        label: 'Semicompliant'
                    },
                    {
                        value: 10,
                        color: '#FF4136',
                        label: 'Noncompliant'
                    }
                ]),
                patients: [
                    {
                        id: 1234,
                        status: 'Noncompliant',
                        statusType: 'danger',
                        stage: 1,
                        lastTaken: '09/05/2015',
                        totalMissed: 5,
                        consecutiveMissed: 2
                    },
                    {
                        id: 6546,
                        status: 'Compliant',
                        statusType: 'success',
                        stage: 1,
                        lastTaken: '09/07/2015',
                        totalMissed: 0,
                        consecutiveMissed: 0
                    },
                    {
                        id: 7865,
                        status: 'Semicompliant',
                        statusType: 'warning',
                        stage: 1,
                        lastTaken: '09/05/2015',
                        totalMissed: 1,
                        consecutiveMissed: 1
                    }
                ]
            });
        }
    });
};

/**
 * Takes in a Trial model and processes them into human readable format
 * @param {Trial} currentTrial - a single Trial object
 * @returns {Object} processed Trial
 */
function processTrial (currentTrial) {
    const trial = currentTrial.dataValues;
    const startDate = moment(trial.startAt);
    const endDate = moment(trial.endAt);

    return {
        id: trial.id,
        name: trial.name,
        description: trial.description,
        start: startDate.format('L'),
        duration: startDate.to(endDate, true),
        // TODO: Currently fake data, make this live data
        patientCount: Math.floor(Math.random() * 900 + 100),
        noncompliantCount: Math.floor(Math.random() * 100)
    };
}
