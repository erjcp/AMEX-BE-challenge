const { parentPort } = require('worker_threads');
const mockFetch = require('../utils/mockFetch');

/*
- The 'dogs' API doesn't need token, so we can directly call the 'mockFetch' function.
*/

// Added Logic to validate that a correlationID exists to pass it to the headers, otherwise we generate one based off of date.
// TODO: good idea to base this off of UUID, also need to see why the header doesn't appear in postman, when I log the response here, all the relevant data shows up.
const handleResponse = async (message) => {
  console.log('handling request to get dogs');
  let correlationIdResponse = message.correlationId;

  if (!correlationIdResponse) {
    correlationIdResponse = Date.now();
  }

  const requestId = message.requestId;
  const response = await mockFetch('dogs');
  response.headers = {
    'correlationid': correlationIdResponse,
  };
  // Left this log enabled to see the response header in console.
  console.log(response);
  parentPort.postMessage({ response, requestId });
}

/*
- Process the request from the main thread, and respond back with the data.
*/
parentPort.on('message', async (message) => {
  await handleResponse(message);
});