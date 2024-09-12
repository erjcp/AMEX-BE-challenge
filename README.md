# American Express Backend Coding Challenge

## Task 1

- Bug was due to a mistake in accessing the data param in "refreshToken". The reason why it would work initially was because the first token could be generated fine, but when it came time to refresh, the worker's error handling would terminate the thread with nothing logged as to why.

- Correcting the issue was as simple as changing the parameter in data from "value" to "key", as value was undefined. 

- Down the line some better error handling on the threads would help debugging, as in the current implementation, the thread terminates very ungracefully. I would begin by logging the errors that result in terminated threads. From there we can format into a more robust logging system.

### Files Changed:
    getCatsWorker.js (Comment where fix was implemented.)

    Some debugging done in generateNewWorker.js but that file is currently unchanged.

## Task 2

- I was able to add the correlationId header in my request and extract it in the code, passing it along to the worker threads along with the requestId.

- Once in the threads (both getDogsWorker and getCatsWorker) I ran a check to see if the correlationId was defined (provided by the user) to determine if it needed to simply be passed along or generated.

- I currently generate the ID just using Date.now() which long term wouldn't be my solution, I would use UUID or something to that effect, but for the sake of this challenge, it does the job.

- I then add the parameter to the response that is retrieved from the mock file.

- Currently the header is showing in the log, which you can see in the console if you run the code, but it doesn't get returned to Postman, which I was using to test this. This would be my next focus moving forward, if given more time.

### Files Changed:
    index.js

    getCatsWorker.js

    getDogsWorker.js


## Task 3

- I added a small TerminateWorker function to index to assist with terminating a passed thread.

- Upon program start, a timeout has been added for both of the threads, where the timeout calls the TerminateWorker function.

- Timeouts are set to 15 minutes.

- Upon recieving a call for getCatsInfo or getDogsInfo, I then check for an existing thread. If a thread exists I restart the timeout, if the thread has already been terminated, I start a new thread and timeout. All these are documented with logs also provided the threadId.

- Long term solution would probably be to incorporate all worker thread login to other files, just like the way the generateNewWorker logic is currently set up.

### Files Changed:
    index.js
    