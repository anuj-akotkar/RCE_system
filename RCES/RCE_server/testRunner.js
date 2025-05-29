// const { runCpp } = require('./runner/cpp/run');

// const code = `
// #include<iostream>
// using namespace std;
// int main() {
//     int a, b;
//     cin >> a >> b;
//     cout << a + b;
//     return 0;
// }
// `;

// const testCases = [
//   { input: "2 3", expected: "5" },
//   { input: "10 20", expected: "30" },
//   { input: "7 4", expected: "11" }
// ];

// runCpp(code, testCases).then(results => {
//   console.log("📋 Test Results:");
//   results.forEach((test, index) => {
//     console.log(`\n🧪 Test Case ${index + 1}:`);
//     console.log(`Input:     ${test.input}`);
//     console.log(`Expected:  ${test.expected}`);
//     console.log(`Output:    ${test.output}`);
//     console.log(test.passed ? "✅ Passed" : "❌ Failed");
//   });
// });


///PYTHON CODE////
// testRunner.js
const { runCpp } = require('./runner/cpp/run');
const { runPython } = require('./runner/python/run');

const cppCode = `
#include<iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}
`;

const pythonCode = `
a, b = map(int, input().split())
print(a + b)
`;

const testCases = [
  { input: "2 3", expected: "5" },
  { input: "10 20", expected: "30" }
];

(async () => {
  console.log("=== C++ Test Results ===");
  const cppResults = await runCpp(cppCode, testCases);
  console.log(cppResults);

  console.log("=== Python Test Results ===");
  const pythonResults = await runPython(pythonCode, testCases);
  console.log(pythonResults);
})();
