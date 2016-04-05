'use strict';

const test = require('ava');
const proxyquire = require('proxyquire');
const bcrypt = require('../../bcrypt-shim');
const comparePromise = proxyquire('../helper/compare-promise', {bcrypt});

test.cb('when values are the same', (t) => {
    comparePromise('test', 'test')
    .then((isValid) => {
        t.true(isValid, 'it should be valid');
        t.end();
    })
    .catch(() => {
        t.fail();
        t.end();
    });
});

test.cb('when values are different', (t) => {
    comparePromise('test', 'not')
    .then((isValid) => {
        t.false(isValid, 'it should not be valid');
        t.end();
    })
    .catch(() => {
        t.fail();
        t.end();
    });
});
