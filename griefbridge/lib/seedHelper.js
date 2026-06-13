import prisma from "./prisma.js";

/**
 * Checks if a user exists in the database. If not, retrieves their details from Clerk
 * (if available) and automatically seeds their profile with initial tasks and memories
 * so the demo is immediately populated and active.
 * 
 * @param {string} userId - Owner ID (e.g. from Clerk auth)
 */
export async function ensureUserAndSeed(userId) {
  if (!userId) return;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existing) {
      return existing;
    }

    console.log(`[AUTH SEED] User ${userId} not found in DB. Auto-registering and seeding...`);

    let email = `${userId}@griefbridge.com`;
    let firstName = "Amit";
    let lastName = "Kumar";

    try {
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      if (clerkUser) {
        email = clerkUser.emailAddresses[0]?.emailAddress || email;
        firstName = clerkUser.firstName || firstName;
        lastName = clerkUser.lastName || lastName;
      }
    } catch (clerkError) {
      console.warn("[AUTH SEED] Clerk currentUser lookup failed or running offline, using defaults:", clerkError.message);
    }

    // Create User record
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        firstName,
        lastName
      }
    });

    // Seed tasks
    const tasksData = [
      {
        title: "Close Dad's SBI Savings Account",
        description: "Notify State Bank of India Sector 15 Chandigarh branch about the demise and request balance transfer to Savitri Devi's account.",
        status: "PENDING",
        priority: "HIGH",
        category: "financial",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Submit Life Insurance Claim to LIC",
        description: "Submit death claim for LIC Policy LIC-883012. Verify cover amount and transfer options.",
        status: "PENDING",
        priority: "HIGH",
        category: "financial",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Update Aadhaar Card with Demise Notice",
        description: "Report demise of Ramesh Kumar to UIDAI and deactivate Aadhaar Card (4930-1829-3810).",
        status: "PENDING",
        priority: "MEDIUM",
        category: "digital",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Apply for Legal Heir Certificate",
        description: "Apply at Chandigarh Tahsildar revenue office. Need survival/legal heir certificate for property transfers.",
        status: "PENDING",
        priority: "HIGH",
        category: "legal",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Cancel Netflix and Spotify accounts",
        description: "Close digital accounts associated with dad's email to stop recurring charges.",
        status: "PENDING",
        priority: "LOW",
        category: "digital",
        userId
      },
      {
        title: "Update Property Mutation for Sector 15 House",
        description: "Submit property mutation request to Chandigarh Revenue Office for House 102, Sector 15-A.",
        status: "PENDING",
        priority: "HIGH",
        category: "legal",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Transfer Family Pension to Savitri Devi",
        description: "Apply for family pension transition at Central Pension Accounting Office under PPO-7890123-CHD.",
        status: "PENDING",
        priority: "HIGH",
        category: "financial",
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Transfer Electricity Connection to Savitri Devi",
        description: "Request transfer of Electricity connection ELEC-CHD-94921 to next of kin Savitri Devi.",
        status: "PENDING",
        priority: "MEDIUM",
        category: "utility",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        userId
      },
      {
        title: "Notify Dad's Employer TCS about Demise",
        description: "Notify HR department of Tata Consultancy Services (TCS) under Employee ID EMP-TCS-889102 for settlement.",
        status: "PENDING",
        priority: "MEDIUM",
        category: "financial",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId
      }
    ];

    for (const task of tasksData) {
      await prisma.task.create({ data: task });
    }

    const claimantName = `${firstName} ${lastName}`.trim();

    // Seed memories
    const memoriesData = [
      {
        type: "text",
        content: "Deceased details: Ramesh Kumar, born April 12, 1954, residing at House 102, Sector 15-A, Chandigarh. Passed away on June 5, 2026, at Chandigarh General Hospital due to cardiac arrest.",
        metadata: { source: "death_certificate_notes" },
        userId
      },
      {
        type: "voice",
        content: "Transcript from conversation with Mom: 'Your father had his main savings account with State Bank of India, Chandigarh Sector 15 Branch. The account number is 30219488310. I am registered as the nominee. For the balance transfer, we should transfer it to my ICICI savings account. My account number is 00293818293, and the IFSC code is ICIC0000029. My full name is Savitri Devi.'",
        metadata: { speaker: "Savitri Devi (Mom)", date: "2026-06-10" },
        userId
      },
      {
        type: "text",
        content: `Life Insurance Details: LIC Policy number: LIC-883012. Claimant / Nominee: ${claimantName} (Son), Date of Birth: August 20, 1985. Email: ${email}, Phone: +91 98765 43210. Address: House 102, Sector 15-A, Chandigarh.`,
        metadata: { source: "insurance_policy_binder" },
        userId
      },
      {
        type: "text",
        content: `Legal Heir Details: Surviving family members are Savitri Devi (Wife, age 68, Homemaker) and ${claimantName} (Son, age 40, Software Engineer). No other heirs exist.`,
        metadata: { source: "family_records" },
        userId
      },
      {
        type: "text",
        content: "Official documents: Death Certificate Registration Number is DC-Chandigarh/2026/89481 issued by Registrar of Births and Deaths, Chandigarh. Ramesh Kumar's Aadhaar number is 4930-1829-3810.",
        metadata: { source: "government_records" },
        userId
      }
    ];

    const { embedText } = await import("../tools/memoryTools.js");
    for (const memory of memoriesData) {
      const embedding = await embedText(memory.content);
      await prisma.memory.create({
        data: {
          ...memory,
          embedding
        }
      });
    }

    console.log(`[AUTH SEED] Seeding completed for user ${userId}!`);
    return user;
  } catch (error) {
    console.error(`[AUTH SEED] Error seeding user ${userId}:`, error);
  }
}
