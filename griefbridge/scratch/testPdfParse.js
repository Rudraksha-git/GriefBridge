import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

async function main() {
  const pdfPath = path.join(process.cwd(), 'public', 'sample_memory.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error(`File not found: ${pdfPath}`);
    return;
  }

  const dataBuffer = fs.readFileSync(pdfPath);
  try {
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();

    console.log("PDF parsed successfully!");
    console.log("Text content preview:\n", result.text.substring(0, 500));
  } catch (err) {
    console.error("Failed to parse PDF:", err);
  }
}

main();
