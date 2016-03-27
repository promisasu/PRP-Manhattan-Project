'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const QueryTypes = {
    SELECT: 'select'
};
const zero = 0;
const one = 1;
const httpNotFound = 404;

test.cb('when patient has one survey', (t) => {
    const query = sinon.stub();

    query
    .onFirstCall()
    .returns(Promise.resolve({
        pin: 1,
        stage: 'example'
    }));

    query
    .onSecondCall()
    .returns(Promise.resolve([
        {
            id: 1,
            startTime: new Date(),
            endTime: new Date(),
            userSubmissionTime: new Date(),
            state: 'completed',
            surveyTemplateId: 1,
            stageName: 'example',
            surveyTemplateName: 'example'
        }
    ]));

    query
    .onThirdCall()
    .returns(Promise.resolve({
        id: 1,
        name: 'example'
    }));

    const patientCSV = proxyquire('../handler/patient', {
        '../../model': {
            sequelize: {query, QueryTypes}
        }
    });

    const request = {
        log: sinon.stub(),
        params: {
            pin: 1
        }
    };

    const reply = {
        view: (template, data) => {
            t.is(template, 'patient', 'it should render patient view');
            t.true(data.surveys instanceof Array, 'it should have an array of surveys');
            t.is(data.surveys.length, one, 'it should have one survey');
            t.end();
        }
    };

    patientCSV(request, reply);
});

test.cb('when patient has no surveys', (t) => {
    const query = sinon.stub();

    query
    .onFirstCall()
    .returns(Promise.resolve({
        pin: 1,
        stage: 'example'
    }));

    query
    .onSecondCall()
    .returns(Promise.resolve([]));

    query
    .onThirdCall()
    .returns(Promise.resolve({
        id: 1,
        name: 'example'
    }));

    const patientCSV = proxyquire('../handler/patient', {
        '../../model': {
            sequelize: {query, QueryTypes}
        }
    });

    const request = {
        log: sinon.stub(),
        params: {
            pin: 1
        }
    };

    const reply = {
        view: (template, data) => {
            t.is(template, 'patient', 'it should render patient view');
            t.true(data.surveys instanceof Array, 'it should have an array of surveys');
            t.is(data.surveys.length, zero, 'it should have an empty array of surveys');
            t.end();
        }
    };

    patientCSV(request, reply);
});

test.cb('when patient does not exist', (t) => {
    const query = sinon.stub();

    query
    .onFirstCall()
    .returns(Promise.resolve(null));

    query
    .onSecondCall()
    .returns(Promise.resolve([]));

    query
    .onThirdCall()
    .returns(Promise.resolve(null));

    const patientCSV = proxyquire('../handler/patient', {
        '../../model': {
            sequelize: {query, QueryTypes}
        }
    });

    const request = {
        log: sinon.stub(),
        params: {
            pin: 1
        }
    };

    const reply = {
        view: (template, data) => {
            t.is(template, '404', 'it should render not found page');
            t.is(data.title, 'Not Found', 'it should have \'not found\' as the title');

            return {
                code: (code) => {
                    t.is(code, httpNotFound, 'it should have not found status code');
                    t.end();
                }
            };
        }
    };

    patientCSV(request, reply);
});
