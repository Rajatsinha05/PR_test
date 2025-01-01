const fs = require("fs");
const path = require("path");

// Resolve paths
const metadataPath = path.resolve(__dirname, "metadata.json");
const resultPath = path.resolve(
  ".github/workflows/cypress/results/mochawesome.json"
);
const gitHubLink = process.argv[2];

/**
 * Read and process metadata.json
 */
fs.readFile(metadataPath, "utf-8", (err, data) => {
  if (err) {
    return;
  }

  try {
    const metadata = JSON.parse(data);

    if (!metadata.uniqueCode || !metadata.secureHash) {
      throw new Error("Missing required fields: 'uniqueCode' or 'secureHash'");
    }

    // Process mochawesome.json
    processTestResult(
      resultPath,
      metadata.secureHash,
      metadata.uniqueCode,
      metadata.pId
    );
  } catch (parseError) {}
});

/**
 * Process mochawesome.json
 */
function processTestResult(filePath, token, uniqueCode, pId) {
  console.log(
    "filePath, token, uniqueCode, pId: ",
    filePath,
    token,
    uniqueCode,
    pId
  );
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return;
    }

    try {
      const testData = JSON.parse(data);

      // Convert to NodeTestResult
      const nodeTestResult = parseToNodeTestResult(testData);

      // Add student_id
      nodeTestResult.student = { id: uniqueCode };
      nodeTestResult.githubLink = gitHubLink;
      nodeTestResult.cyProject = pId;
      // Post the result to the backend
      postResult(nodeTestResult, token);
    } catch (parseError) {}
  });
}

/**
 * Convert mochawesome test data to NodeTestResult
 */
function parseToNodeTestResult(data) {
  const passedTests = [];
  const failedTestsWithReasons = [];
  let totalMarks = 0;

  data.results.forEach((result) => {
    result.suites.forEach((suite) => {
      suite.tests.forEach((test) => {
        if (test.state === "passed") {
          const marks = extractMarksFromTitle(test.title);
          totalMarks += marks;
          passedTests.push(test.title);
        } else if (test.state === "failed") {
          failedTestsWithReasons.push({
            testName: test.title,
            reason: test.err?.message || "Unknown reason",
            // reason: "Unknown reason",
            marks,
          });
        }
      });
    });
  });

  return {
    passed: passedTests.length,
    failed: failedTestsWithReasons.length,
    passedTests,
    failedTestsWithReasons,
    marks: totalMarks,
    errors: [],
    status:
      failedTestsWithReasons.length === 0
        ? "PASSED"
        : passedTests.length > 0
        ? "PARTIAL"
        : "FAILED",
  };
}

/**
 * Extract marks from test title
 */
function extractMarksFromTitle(title) {
  const match = /marks\s([0-9]*\.?[0-9]+)/i.exec(title);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Post result to the backend
 */
async function postResult(data, token) {
  try {
    const response = await fetch(
      "https://practiceapi.rnwmultimedia.com/api/sandbox/result",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to post result: ${response.statusText}`);
    }
  } catch (error) {}
}
