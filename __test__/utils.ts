// File: __test__/utils.ts

import fs from 'fs';
import path from 'path';

/**
 * Writes test results to a CSV file in an __output__ directory next to the calling test file.
 * @param filename The name of the file to write (e.g., 'test_results.csv')
 * @param results An array of objects containing test results
 * @param testFilePath The path of the test file calling this function
 */
export function writeResultsToFile(
  filename: string, 
  results: { ip: string; result: boolean; reason?: string }[],
  testFilePath: string
) {
  const testDir = path.dirname(testFilePath);
  const outputDir = path.join(testDir, '__output__');
  
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fullPath = path.join(outputDir, filename);
  
  const content = results.map(({ ip, result, reason }) => 
    `${ip},${result ? 'PASS' : 'FAIL'}${reason ? `,${reason}` : ''}`
  ).join('\n');
  
  fs.writeFileSync(fullPath, content);
}

// You can add more utility functions here as needed