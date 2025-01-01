const fs = require("fs");
const path = require("path");

// Resolve the path to metadata.json
// const filePath = path.resolve(__dirname, "../../metadata.json");
const filePath = path.resolve(__dirname, "metadata.json");
// console.log("filePath: ", filePath);

/**
 * Reads and parses the JSON file.
 */
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error(`Error reading metadata file: ${err.message}`);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    if (!jsonData.assetTag || !jsonData.secureHash) {
      throw new Error(
        "Required fields 'assetTag' or 'secureHash' are missing in metadata.json"
      );
    }

    getTestFiles(jsonData.assetTag, jsonData.secureHash);
  } catch (parseError) {
    console.error(`Error parsing metadata file: ${parseError.message}`);
  }
});

/**
 * Fetches test files from the server.
 * @param {string} fileName - The name of the test file.
 * @param {string} token - The authorization token.
 */
const getTestFiles = async (fileName, token) => {
  try {
    const response = await fetch(
      `https://practiceapi.rnwmultimedia.com/api/sandbox/test-files/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token dynamically
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch test files: ${response.status} ${response.statusText}`
      );
    }

    const fileData = await response.text(); // Use `response.text()` for non-JSON responses

    // Resolve the write path relative to the current directory
    const writePath = path.resolve(__dirname, "cypress/e2e/test.cy.js");

    // Write the fetched file data
    fs.writeFile(writePath, fileData, (writeErr) => {
      if (writeErr) {
        console.error(`Error writing test file: ${writeErr.message}`);
      } else {
        console.log(`Test file successfully written to: ${writePath}`);
      }
    });
  } catch (error) {
    console.error(`Error fetching test files: ${error.message}`);
  }
};
