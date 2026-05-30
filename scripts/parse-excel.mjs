import { readFile, utils } from 'xlsx';

const workbook = readFile('./Probikers Bikes Stock List.xlsx');

// Print sheet names
console.log("=== SHEET NAMES ===");
console.log(workbook.SheetNames);

// For each sheet, print headers and first rows
for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = utils.sheet_to_json(sheet, { header: 1, defval: "" });
  
  console.log(`\n=== SHEET: ${sheetName} ===`);
  console.log(`Total rows: ${data.length}`);
  
  // Print all rows (limit to avoid huge output)
  const maxRows = Math.min(data.length, 200);
  for (let i = 0; i < maxRows; i++) {
    const row = data[i];
    // Only print non-empty rows
    if (row.some(cell => cell !== "")) {
      console.log(`Row ${i}: ${JSON.stringify(row)}`);
    }
  }
}
