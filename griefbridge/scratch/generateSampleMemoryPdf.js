import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

async function main() {
  const outputPath = path.join(process.cwd(), "public", "sample_memory.pdf");
  
  console.log(`Generating sample memory PDF at ${outputPath}...`);

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 54, bottom: 54, left: 54, right: 54 }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Styling banner
  doc.rect(0, 0, 595.28, 15).fill("#0f6e56"); // Green memory theme accent

  // Title
  doc.fillColor("#085041")
     .font("Helvetica-Bold")
     .fontSize(22)
     .text("Ramesh Kumar — Legacy & Wisdom Record", 54, 45)
     .fontSize(9)
     .font("Helvetica-Oblique")
     .fillColor("#64748b")
     .text("Preserved Family Archive & Oral History Transcripts", 54, 70);

  // Line divider
  doc.moveTo(54, 85).lineTo(541.28, 85).strokeColor("#cbd5e1").lineWidth(1).stroke();

  doc.moveDown(2);

  // Section 1: Childhood stories
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#085041").text("1. Early Life & Memories of Lahore");
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10.5).fillColor("#334155").lineGap(4).text(
    "Ramesh often spoke about his childhood years spent in Lahore before the partition in 1947. " +
    "He recalled the narrow, lively brick lanes of the old city, the sweet aroma of fresh tandoori roti wafting through the morning air, " +
    "and playing street cricket with his cousins near the outer gateway. He mentioned that the summers were scorching, " +
    "but they would cool off by eating sweet mangoes chilled in a bucket of well water. These early memories remained " +
    "vivid and formed the core of the stories he shared around the dinner table with his children."
  );

  doc.moveDown(1.5);

  // Section 2: Career Advice
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#085041").text("2. Wisdom & Career Advice on Setbacks");
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10.5).fillColor("#334155").lineGap(4).text(
    "His primary career advice to his son, Amit, was: \"Every setback in business is a setup for a comeback, " +
    "provided you have the honesty to inspect what went wrong and the patience to start again.\" " +
    "He shared this first during the printing shop crisis in Sector 15 Chandigarh in 1987, when paper costs surged " +
    "and they nearly lost the family press. He believed that integrity with suppliers and transparency with clients " +
    "were the only long-term values that mattered in professional life."
  );

  doc.moveDown(1.5);

  // Section 3: Family Recipes
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#085041").text("3. Nani's Traditional Gajar ka Halwa Recipe");
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10.5).fillColor("#334155").lineGap(4).text(
    "Ramesh was fond of cooking traditional family desserts. He preserved Dadi and Nani's exact recipe for winter Gajar ka Halwa:\n" +
    "• Ingredients: 1 kg red carrots (finely grated), 1.5 liters full-fat organic milk, 200g sugar, 4 tbsp pure ghee, and 50g mixed chopped almonds, cashews, and cardamom powder.\n" +
    "• Instructions: Simmer the grated carrots in milk in a heavy-bottomed kadhai over low heat for approximately 2 hours, stirring occasionally to prevent burning. Once the milk is fully evaporated and the carrots are soft, stir in the ghee and sugar. Sauté on medium heat for 15 minutes until it glistens. Garnish with almonds and cardamoms."
  );

  // Footer disclaimer
  doc.fontSize(8.5).fillColor("#94a3b8").font("Helvetica-Oblique");
  doc.text(
    "Verified Legacy Document · GriefBridge Archive Vault",
    54,
    750,
    { width: 487, align: "center" }
  );

  doc.end();

  writeStream.on("finish", () => {
    console.log("PDF generated successfully!");
  });
}

main().catch(console.error);
