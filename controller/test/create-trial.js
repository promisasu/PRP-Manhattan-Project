'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

/**
 * Mock sequelize
 * @returns {Object} mocked sequelize object
 */
function mockSequelize () {
    // stub properties
    const model = sinon.stub();
    const transaction = sinon.stub();

    // trial model
    model
    .onFirstCall()
    .returns({
        find: Promise.resolve({}),
        create: () => {
            return Promise.resolve({
                id: 1,
                addStages: () => {
                    return Promise.resolve();
                }
            });
        }
    });

    // stage model
    model
    .onSecondCall()
    .returns({
        find: Promise.resolve({}),
        create: () => {
            return Promise.resolve();
        }
    });

    transaction.returns(Promise.resolve({
        commit: sinon.stub(),
        rollback: sinon.stub()
    }));

    return {model, transaction};
}

test.cb('when a trial is created', (t) => {
    const sequelize = mockSequelize();

    const createTrial = proxyquire('../handler/create-trial', {
        '../../model': {sequelize}
    });

    const fakeRequest = {
        payload: {
            name: 'test',
            description: 'test',
            IRBID: 'test',
            IRBStart: '2000-01-01',
            IRBEnd: '2001-01-01',
            targetCount: 10,
            stagecount: 3,
            stageName: 'one,two,three'
        }
    };

    const reply = {
        redirect: (route) => {
            t.is(route, '/trial/1', 'redirect to new trial');
            t.end();
        }
    };

    createTrial(fakeRequest, reply);
});

test.cb('when stage number does not match, fail', (t) => {
    const sequelize = mockSequelize();

    const createTrial = proxyquire('../handler/create-trial', {
        '../../model': {sequelize}
    });

    const request = {
        log: sinon.stub(),
        payload: {
            name: 'test',
            description: 'test',
            IRBID: 'test',
            IRBStart: '2000-01-01',
            IRBEnd: '2001-01-01',
            targetCount: 10,
            stagecount: 3,
            stageName: 'one,two'
        }
    };

    const reply = (data) => {
        t.is(data.name, 'Error', 'it should have an Error object');
        t.end();
    };

    createTrial(request, reply);
});
