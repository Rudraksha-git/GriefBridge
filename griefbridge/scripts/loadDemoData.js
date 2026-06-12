import prisma from "../lib/prisma.js";

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean up existing tables in reverse order of relations
  console.log("Cleaning up existing data...");
  await prisma.document.deleteMany({});
  await prisma.memory.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create the demo user
  const demoUserId = "user_demo";
  console.log(`Creating demo user: ${demoUserId}...`);
  const demoUser = await prisma.user.create({
    data: {
      id: demoUserId,
      email: "demo@griefbridge.com",
      firstName: "Amit",
      lastName: "Kumar",
    },
  });

  // 3. Create sample tasks
  console.log("Seeding tasks...");
  const tasksData = [
    {
      title: "Close Dad's SBI Savings Account",
      description: "Notify State Bank of India Sector 15 Chandigarh branch about the demise and request balance transfer to Savitri Devi's account.",
      status: "PENDING",
      priority: "HIGH",
      category: "financial",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      userId: demoUserId
    },
    {
      title: "Submit Life Insurance Claim to LIC",
      description: "Submit death claim for LIC Policy LIC-883012. Verify cover amount and transfer options.",
      status: "PENDING",
      priority: "HIGH",
      category: "financial",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: demoUserId
    },
    {
      title: "Update Aadhaar Card with Demise Notice",
      description: "Report demise of Ramesh Kumar to UIDAI and deactivate Aadhaar Card (4930-1829-3810).",
      status: "PENDING",
      priority: "MEDIUM",
      category: "digital",
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      userId: demoUserId
    },
    {
      title: "Apply for Legal Heir Certificate",
      description: "Apply at Chandigarh Tahsildar revenue office. Need survival/legal heir certificate for property transfers.",
      status: "PENDING",
      priority: "HIGH",
      category: "legal",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      userId: demoUserId
    },
    {
      title: "Cancel Netflix and Spotify accounts",
      description: "Close digital accounts associated with dad's email to stop recurring charges.",
      status: "PENDING",
      priority: "LOW",
      category: "digital",
      userId: demoUserId
    }
  ];

  for (const task of tasksData) {
    await prisma.task.create({ data: task });
  }

  // 4. Create sample memories (RAG / Context Source data)
  console.log("Seeding family memories and document records...");
  const memoriesData = [
    {
      type: "text",
      content: "Deceased details: Ramesh Kumar, born April 12, 1954, residing at House 102, Sector 15-A, Chandigarh. Passed away on June 5, 2026, at Chandigarh General Hospital due to cardiac arrest.",
      metadata: { source: "death_certificate_notes" },
      userId: demoUserId
    },
    {
      type: "voice",
      content: "Transcript from conversation with Mom: 'Your father had his main savings account with State Bank of India, Chandigarh Sector 15 Branch. The account number is 30219488310. I am registered as the nominee. For the balance transfer, we should transfer it to my ICICI savings account. My account number is 00293818293, and the IFSC code is ICIC0000029. My full name is Savitri Devi.'",
      metadata: { speaker: "Savitri Devi (Mom)", date: "2026-06-10" },
      userId: demoUserId
    },
    {
      type: "text",
      content: "Life Insurance Details: LIC Policy number: LIC-883012. Claimant / Nominee: Amit Kumar (Son), Date of Birth: August 20, 1985. Email: demo@griefbridge.com, Phone: +91 98765 43210. Address: House 102, Sector 15-A, Chandigarh.",
      metadata: { source: "insurance_policy_binder" },
      userId: demoUserId
    },
    {
      type: "text",
      content: "Legal Heir Details: Surviving family members are Savitri Devi (Wife, age 68, Homemaker) and Amit Kumar (Son, age 40, Software Engineer). No other heirs exist.",
      metadata: { source: "family_records" },
      userId: demoUserId
    },
    {
      type: "text",
      content: "Official documents: Death Certificate Registration Number is DC-Chandigarh/2026/89481 issued by Registrar of Births and Deaths, Chandigarh. Ramesh Kumar's Aadhaar number is 4930-1829-3810.",
      metadata: { source: "government_records" },
      userId: demoUserId
    }
  ];

  for (const memory of memoriesData) {
    await prisma.memory.create({ data: memory });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
