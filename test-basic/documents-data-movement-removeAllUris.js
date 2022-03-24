/*
 * Copyright (c) 2022 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const should = require('should');
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');

let removeStream = new Stream.PassThrough({objectMode: true});
let uris = [];

describe('data movement removeAllUris', function() {

    beforeEach(function (done) {
        let readable = new Stream.Readable({objectMode: true});
        removeStream = new Stream.PassThrough({objectMode: true});
        for(let i=0; i<100; i++) {
            const temp = {
                uri: '/test/dataMovement/requests/removeAllUris/'+i+'.json',
                contentType: 'application/json',
                content: {['key']:'initialValue'}
            };
            readable.push(temp);
            removeStream.push(temp.uri);
            uris.push(temp.uri);
        }
        readable.push(null);
        removeStream.push(null);

        readable.pipe(dbWriter.documents.writeAll({
            onCompletion: ((summary) => {
                done();
            })
        }));

    });


    it('TBD', done => {

        removeStream.pipe(dbWriter.documents.removeAllUris ({
            onCompletion: ((summary) => {
                verifyDocs(done);
            })
        }));
    });

});

function verifyDocs(done){
    dbWriter.documents.read(uris)
        .result(function (documents) {
            documents.length.should.equal(0);

        })
        .then(()=> done())
        .catch(err=> done(err));
}
