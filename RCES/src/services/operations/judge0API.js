import axios from "axios";

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  // Add your RapidAPI key if needed:
  // "X-RapidAPI-Key": "YOUR_KEY",
  // "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
};

// Helper to poll for result
async function pollSubmission(token) {
  for (let i = 0; i < 10; i++) {
    const { data } = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      { headers: JUDGE0_HEADERS }
    );
    if (data.status && data.status.id >= 3) return data;
    await new Promise(res => setTimeout(res, 1000));
  }
  throw new Error("Timeout waiting for Judge0 result");
}

// Run code (single test case)
export async function judge0Run({ source_code, language_id, stdin }) {
  const { data } = await axios.post(
    `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=false`,
    { source_code, language_id, stdin },
    { headers: JUDGE0_HEADERS }
  );
  const result = await pollSubmission(data.token);
  // Format for OutputPanel
  return {
    success: result.status.id === 3,
    results: [
      {
        input: stdin,
        expectedOutput: null,
        output: result.stdout,
        actualOutput: result.stdout,
        passed: result.status.id === 3,
        error: result.stderr || result.compile_output,
      },
    ],
    error: result.stderr || result.compile_output,
    message: result.status.description,
    raw: result,
  };
}

// Submit code (full evaluation, can be extended for multiple test cases)
export async function judge0Submit({ source_code, language_id, stdin }) {
  // For now, same as run; extend for multiple test cases if needed
  return judge0Run({ source_code, language_id, stdin });
}