// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.


/*====================
  Test data

  Keep track of tests
====================*/
var testData={};
function registerTestSuite(key, suite) {
    if(key === null) {
        console.error("Unable to register test suite with null key.");
        return;
    }

    if(testData && suite) {
        if(testData[key] === undefined) {
            testData[key] = suite;
        } else {
            console.warn("Skipping registration for test suite entry. Key already exists: " + key);
            return;
        }
    } else {
        console.error("Unexpected failure: unable to access test suite data. testData: ", testData, " suite: ", suite);
        return;
    }
}

/*====================
  Latest test data

  Keep track of statistics
====================*/
var successCount;
var failureCount;
var totalTestCount;
var reporterStatus;

//
// Initial state is reset
dataReset();

//
// Cleanup data
function dataReset() {
    testData={};
    successCount=0;
    failureCount=0;
    totalTestCount=0;
    reporterStatus="";
}

function dataIncrementSuccess() {
    successCount++;
    console.log("[TestRunner] increased success counter: " + successCount);
}

function dataIncrementFailure() {
    failureCount++;
    console.log("[TestRunner] increased failure counter: " + failureCount);
}

function dataAddTotalTestCount(count) {
    totalTestCount += count;
}

export function readReportOutput() {
    return testData;
}

export function readReportSuccesses() {
    return successCount;
}

export function readReportFailures() {
    return failureCount;
}

export function readTotalTestCount() {
    return totalTestCount;
}

export function readReporterStatus() {
    return reporterStatus;
}

export function CustomReporter(runner) {
    runner.on("suite", function(suite){
        // TODO: FIXME: input data error handling
        console.log("[TestRunner] incremented test data: ", suite);

        const parentReference = suite.parent;
        if(parentReference) {
            // TODO: FIXME: reference error handling
            const key=suite.parent.title.split(": ")[1]; // extract title
            // TODO: FIXME: reference error handling
            if(suite.tests.length > 0) {
                dataAddTotalTestCount(suite.tests.length);
                console.log("[TestRunner] suite \"" + suite.title + "\" total test count: " + readTotalTestCount());
                for(var i=0;i<suite.tests.length;i++) {
                    registerTestSuite(key, suite);
                }
            }
        }
    });

    runner.on("pass", function(test){
        // TODO: FIXME: input data error handling
        dataIncrementSuccess();
    });

    runner.on("fail", function(test, error){
        // TODO: FIXME: input data error handling
        dataIncrementFailure();
        // TODO: FIXME: error handling
        console.error(error);

        // TODO: FIXME: error handling
        const stack = error.stack.split("\n").map(
            function(line){
                return line.trim();
            }
        );

        // TODO: FIXME: error handling
        const generatedError=stack[1].split("<anonymous>:")[1];
        if(generatedError){
            // TODO: FIXME: error handling
            const reason=stack[0].split("Error: ")[1];
            const line=generatedError.split(":")[0];
            const column=generatedError.split(":")[1].split(")")[0];
            const errorOutput="Failure in line " + line + " column " + column + ". Reason: " + reason;
            console.error(errorOutput);
            reporterStatus = errorOutput;
        } else {
            reporterStatus = error;
        }
    });

    runner.on("start", function(){
        dataReset();
    });

    runner.on("end", function(){
        console.log("[TestRunner] ended test run with status: ", successCount, failureCount, testData);
        return successCount, failureCount, testData
    });

    // TODO:
    // control other events here
    //
    //start: Execution started
    //suite: Test suite execution started
    //suite end: All tests (and sub-suites) have finished
    //test: Test execution started
    //test end: Test completed
    //hook: Hook execution started
    //hook end: Hook complete
    //pending: Test pending
}