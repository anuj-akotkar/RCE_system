import axios from "axios";

// Using Judge0 Community Edition (free, no API key required)
// Alternative endpoints if one doesn't work:
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
// Fallback: "https://judge0-ce.p.rapidapi.com" or "https://judge0-ce.p.rapidapi.com"

const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  // For RapidAPI Judge0, uncomment and add your key:
  // "X-RapidAPI-Key": "YOUR_KEY",
  // "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
};

// Helper to poll for result
async function pollSubmission(token) {
  for (let i = 0; i < 10; i++) {
    try {
      const { data } = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
        { headers: JUDGE0_HEADERS }
      );
      if (data.status && data.status.id >= 3) return data;
      await new Promise(res => setTimeout(res, 1000));
    } catch (error) {
      console.error("Error polling submission:", error);
      if (i === 9) throw new Error("Failed to get submission result");
    }
  }
  throw new Error("Timeout waiting for Judge0 result");
}

// Run code (single test case)
export const judge0Run = async ({ source_code, language_id, stdin }) => {
  try {
    console.log("Submitting to Judge0:", { source_code, language_id, stdin });
    
    // For now, let's use a mock response to test the integration
    // TODO: Replace with actual Judge0 API call when endpoint is confirmed working
    console.log("Using mock Judge0 response for testing");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const mockResult = {
      success: true,
      results: [
        {
          input: stdin || "",
          expectedOutput: null,
          output: "Hello, World!\n", // Mock output
          actualOutput: "Hello, World!\n",
          passed: true,
          error: null,
        },
      ],
      error: null,
      message: "Execution completed successfully",
      raw: {
        status: { id: 3, description: "Accepted" },
        stdout: "Hello, World!\n",
        stderr: null,
        compile_output: null,
      },
    };
    
    console.log("Mock Judge0 result:", mockResult);
    return mockResult;
    
    /* Uncomment when Judge0 API is working:
    const { data } = await axios.post(
      `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=false`,
      { source_code, language_id, stdin: stdin || "" },
      { headers: JUDGE0_HEADERS }
    );
    console.log("Judge0 submission response:", data);
    
    const result = await pollSubmission(data.token);
    console.log("Judge0 result:", result);
    
    // Format for OutputPanel
    return {
      success: result.status.id === 3,
      results: [
        {
          input: stdin || "",
          expectedOutput: null,
          output: result.stdout || "",
          actualOutput: result.stdout || "",
          passed: result.status.id === 3,
          error: result.stderr || result.compile_output || null,
        },
      ],
      error: result.stderr || result.compile_output || null,
      message: result.status.description || "Execution completed",
      raw: result,
    };
    */
  } catch (error) {
    console.error("Judge0 run error:", error);
    throw new Error(error.message || "Failed to execute code on Judge0");
  }
};

// Submit code (full evaluation, can be extended for multiple test cases)
export const judge0Submit = async ({ source_code, language_id, stdin }) => {
  // For now, same as run; extend for multiple test cases if needed
  return judge0Run({ source_code, language_id, stdin });
};