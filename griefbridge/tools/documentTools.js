import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import PDFDocument from "pdfkit";

/**
 * Fills a Handlebars template and generates a structured, formal PDF.
 * @param {string} templateName - Name of the template (e.g., 'bank_closure')
 * @param {object} context - Template variables
 * @param {string} outputFilename - Name of the output PDF file (e.g., 'bank_closure_123.pdf')
 * @returns {Promise<string>} - The public path to the generated PDF (e.g., '/documents/bank_closure_123.pdf')
 */
export async function generateDocument(templateName, context, outputFilename) {
  const templatePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`);
  }
  const templateSource = fs.readFileSync(templatePath, "utf8");
  
  // Compile Handlebars template
  const template = handlebars.compile(templateSource);
  const compiledText = template(context);

  // Ensure public/documents output directory exists
  const outputDir = path.join(process.cwd(), "public", "documents");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 54, bottom: 54, left: 54, right: 54 }
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Top accent banner
      doc.rect(0, 0, 595.28, 15).fill("#1e3a8a"); // Deep blue primary

      // Document branding / header
      doc.fillColor("#1e3a8a")
         .font("Helvetica-Bold")
         .fontSize(20)
         .text("GriefBridge Support Services", 54, 35)
         .fontSize(8)
         .font("Helvetica-Oblique")
         .fillColor("#64748b")
         .text("AI-Assisted Legacy & Bereavement Document Draft", 54, 58);

      // Divider line
      doc.moveTo(54, 75).lineTo(541.28, 75).strokeColor("#cbd5e1").lineWidth(1).stroke();

      // Process and render text
      const lines = compiledText.split("\n");
      let spacingCount = 0;

      // Font configurations
      doc.fillColor("#1e293b").font("Helvetica").fontSize(11);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.toLowerCase().startsWith("subject:")) {
          doc.moveDown(1.2);
          doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a");
          doc.text(line, { align: "left", width: 487 });
          doc.font("Helvetica").fontSize(11).fillColor("#1e293b");
          doc.moveDown(1.2);
          continue;
        }

        if (line === "To," || line.startsWith("To:")) {
          doc.moveDown(0.8);
          doc.font("Helvetica-Bold");
          doc.text(line);
          doc.font("Helvetica");
          continue;
        }

        if (line.startsWith("Sincerely") || line.startsWith("Yours faithfully") || line.startsWith("Yours sincerely")) {
          doc.moveDown(1.5);
          doc.text(line);
          continue;
        }

        if (line.startsWith("____") || line.startsWith("----")) {
          doc.moveDown(2.0); // space for actual signature
          doc.text(line);
          continue;
        }

        if (line === "") {
          // Avoid multiple consecutive blank lines stretching page
          spacingCount++;
          if (spacingCount <= 1) {
            doc.moveDown(0.4);
          }
        } else {
          spacingCount = 0;
          doc.text(line, { align: "justify", width: 487, lineGap: 3 });
        }
      }

      // Add a fine disclaimer footer at bottom of first page
      doc.fontSize(8).fillColor("#94a3b8").font("Helvetica");
      doc.text(
        "Disclaimer: This document was automatically drafted by GriefBridge to assist with bereavement administrative procedures. Please verify all details and execute standard processes before submission.",
        54,
        750,
        { width: 487, align: "center" }
      );

      doc.end();

      writeStream.on("finish", () => {
        resolve(`/documents/${outputFilename}`);
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}
