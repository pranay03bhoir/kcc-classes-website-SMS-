const axios = require("axios");

// Test the refresh token functionality
async function testRefreshToken() {
  try {
    console.log("Testing refresh token functionality...");

    // Test admin refresh endpoint
    const adminRefreshResponse = await axios.post(
      "http://localhost:5000/api/admin/refresh",
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Admin refresh response:", adminRefreshResponse.data);
  } catch (error) {
    console.error(
      "Error testing refresh token:",
      error.response?.data || error.message
    );
  }
}

testRefreshToken();
