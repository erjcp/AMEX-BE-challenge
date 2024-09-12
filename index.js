const fastify = require('fastify')({ logger: true, connectionTimeout: 5000 });
const generateNewWorker = require('./utils/generateNewWorker');
const requestTracker = require('./utils/requestTracker');

// Setting timeout condition on thread creation.

let getCatsWorker = generateNewWorker('getCatsWorker');
console.log('getCatsWorker thread created: ' + getCatsWorker.threadId);
let catWorkerTimeout = setTimeout(function () {
  TerminateWorker(getCatsWorker);
}, 900000);

let getDogsWorker = generateNewWorker('getDogsWorker');
console.log('getDogsWorker thread created: ' + getDogsWorker.threadId);
let dogWorkerTimeout = setTimeout(function () {
  TerminateWorker(getDogsWorker);
}, 900000);

// Upon recieving an API call, go ahead and check the status of the corresponding worker thread, and then either reset the timeout, or recreate the thread if needed.
// This is done for both Cats and Dogs.

fastify.get('/getCatsInfo', function handler(request, reply) {

  if (getCatsWorker.threadId != -1) {
    clearTimeout(catWorkerTimeout);
    catWorkerTimeout = setTimeout(function () {
      TerminateWorker(getCatsWorker);
    }, 900000);
  } else {
    getCatsWorker = generateNewWorker('getCatsWorker');
    console.log('getCatsWorker thread created: ' + getCatsWorker.threadId);
    catWorkerTimeout = setTimeout(function () {
      TerminateWorker(getCatsWorker);
    }, 900000);
  }

  requestTracker[request.id] = (result) => reply.send(result)
  getCatsWorker.postMessage({
    requestId: request.id,
    correlationId: request.headers.correlationid
  });
})

fastify.get('/getDogsInfo', function handler(request, reply) {

  if (getDogsWorker.threadId != -1) {
    clearTimeout(dogWorkerTimeout);
    dogWorkerTimeout = setTimeout(function () {
      TerminateWorker(getDogsWorker);
    }, 900000);
  } else {
    getDogsWorker = generateNewWorker('getDogsWorker');
    console.log('getDogsWorker thread created: ' + getDogsWorker.threadId);
    dogWorkerTimeout = setTimeout(function () {
      TerminateWorker(getDogsWorker);
    }, 900000);
  }

  requestTracker[request.id] = (result) => reply.send(result)
  getDogsWorker.postMessage({
    requestId: request.id,
    correlationId: request.headers.correlationid
  });
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

// Worker threads can be passed here to terminate and log the threadId terminted

async function TerminateWorker(worker) {
  console.log("worker thread terminated: " + worker.threadId);
  await worker.terminate();
}




