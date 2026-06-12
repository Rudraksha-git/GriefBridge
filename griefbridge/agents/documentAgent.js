import prisma from "../lib/prisma.js";
import anthropic from "../lib/anthropic.js";
import { generateDocument } from "../tools/documentTools.js";

/**
 * Main function for the Document Agent to analyze, draft and generate a document.
 * @param {string} userId - ID of the user request is for
 * @param {string} taskId - ID of the task associated with the document
 * @param {string} documentType - Optional hint for document type (e.g. 'bank_closure')
 * @param {object} additionalContext - Extra facts or memory details to supply
 */
export async function runDocumentAgent(userId, taskId, documentType = null, additionalContext = {}) {
  // 1. Fetch user, task and user memories from the DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { memories: true }
  });

  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!user || !task) {
    throw new Error(`User or Task not found for ID: user=${userId}, task=${taskId}`);
  }

  // 2. Format context for Claude
  const memoriesContext = user.memories.map(m => `[Memory - Type: ${m.type}]: ${m.content}`).join("\n");
  
  // Define available templates and their schemas
  const templateManifest = {
    bank_closure: {
      description: "Request to close a bank account and transfer the balance.",
      requiredFields: ["bankName", "bankBranch", "accountNumber", "deceasedName", "dateOfDeath", "claimantBankName", "claimantAccountNumber", "claimantIfsc", "claimantName", "relationship", "claimantPhone", "deathCertificateNo", "currentDate"]
    },
    insurance_claim: {
      description: "Formal claim submission letter for life insurance policy payouts.",
      requiredFields: ["insuranceCompany", "insuranceBranchAddress", "policyNumber", "deceasedName", "deceasedDob", "dateOfDeath", "causeOfDeath", "placeOfDeath", "claimantName", "claimantDob", "relationship", "claimantBankName", "claimantAccountNumber", "claimantIfsc", "claimantEmail", "claimantPhone", "deathCertificateNo", "currentDate"]
    },
    legal_heir: {
      description: "Petition/Application to local government/revenue authorities for Legal Heir Certificate.",
      requiredFields: ["revenueOfficeName", "revenueOfficeAddress", "deceasedName", "dateOfDeath", "placeOfDeath", "deceasedAddress", "legalHeirs", "claimantName", "claimantAddress", "claimantPhone", "deathCertificateNo", "currentDate"],
      note: "legalHeirs must be an array of objects: {name, age, relationship, occupation}"
    },
    epf: {
      description: "Application for Employee Provident Fund withdrawal and pension benefits.",
      requiredFields: ["epfoOfficeName", "epfoOfficeAddress", "epfMemberId", "uanNumber", "deceasedName", "dateOfDeath", "employerName", "claimantName", "relationship", "claimantBankName", "claimantAccountNumber", "claimantIfsc", "claimantPhone", "claimantEmail", "deathCertificateNo", "currentDate"]
    },
    aadhaar: {
      description: "Deactivation or demise update request to Unique Identification Authority of India (UIDAI).",
      requiredFields: ["uidaiOfficeName", "uidaiOfficeAddress", "aadhaarNumber", "deceasedName", "deceasedDob", "deceasedAddress", "dateOfDeath", "deathCertificateNo", "claimantName", "relationship", "claimantPhone", "claimantAddress", "currentDate"]
    }
  };

  // 3. Invoke Claude to determine target template and extract context values
  const systemPrompt = `You are the GriefBridge Document Assistant, specialized in drafting bereavement, legal, and financial transition documents.
Your goal is to choose the correct document template based on the task description and user query, and fill out the fields accurately.

Available templates and required fields:
${JSON.stringify(templateManifest, null, 2)}

User profile details:
- Name: ${user.firstName || ""} ${user.lastName || ""}
- Email: ${user.email}

Associated Task:
- Title: ${task.title}
- Description: ${task.description || ""}

Shared Memories context:
${memoriesContext}

Additional Context provided:
${JSON.stringify(additionalContext, null, 2)}

Today's Date is: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

Your job is to output a single JSON object.
If the task description refers to closing a bank account, use "bank_closure".
If the task refers to claiming life insurance, use "insurance_claim".
If the task refers to legal heirs or survival certificate, use "legal_heir".
If the task refers to PF or EPF, use "epf".
If the task refers to Aadhaar card update or cancel, use "aadhaar".

If there is no direct fit, choose the closest template.

For the JSON output:
1. Provide "template" field containing one of: "bank_closure", "insurance_claim", "legal_heir", "epf", "aadhaar".
2. Provide a "fields" field containing key-value pairs matching all the required fields of that template.
3. If some details are missing from the context, infer them if possible or create a descriptive placeholder in brackets like "[Enter Claimant IFSC here]" or "[Provide Policy Number]".
4. Return ONLY valid JSON, no other text or explanation.`;

  let selectedTemplate = documentType;
  let filledFields = {};

  if (process.env.MOCK_AI === "true") {
    console.log(`[MOCK MODE] DocumentAgent drafting for: "${task.title}"`);
    if (!selectedTemplate) {
      const titleLower = task.title.toLowerCase();
      if (titleLower.includes("bank") || titleLower.includes("sbi")) {
        selectedTemplate = "bank_closure";
      } else if (titleLower.includes("insurance") || titleLower.includes("lic")) {
        selectedTemplate = "insurance_claim";
      } else if (titleLower.includes("aadhaar")) {
        selectedTemplate = "aadhaar";
      } else if (titleLower.includes("heir") || titleLower.includes("legal")) {
        selectedTemplate = "legal_heir";
      } else if (titleLower.includes("epf") || titleLower.includes("pf")) {
        selectedTemplate = "epf";
      } else {
        selectedTemplate = "bank_closure";
      }
    }

    // Pre-populate mock fields matching template schemas
    filledFields = {
      bankName: "State Bank of India",
      bankBranch: "Sector 15, Chandigarh",
      accountNumber: "30219488310",
      deceasedName: "Ramesh Kumar",
      dateOfDeath: "June 5, 2026",
      deceasedDob: "April 12, 1954",
      placeOfDeath: "Chandigarh General Hospital",
      deceasedAddress: "House 102, Sector 15-A, Chandigarh",
      claimantBankName: "ICICI Bank",
      claimantAccountNumber: "00293818293",
      claimantIfsc: "ICIC0000029",
      claimantName: "Savitri Devi",
      relationship: "Wife",
      claimantPhone: "+91 98765 43210",
      claimantEmail: "demo@griefbridge.com",
      claimantAddress: "House 102, Sector 15-A, Chandigarh",
      claimantDob: "September 15, 1958",
      deathCertificateNo: "DC-Chandigarh/2026/89481",
      insuranceCompany: "LIC India",
      insuranceBranchAddress: "Chandigarh Division Office Office-1",
      policyNumber: "LIC-883012",
      causeOfDeath: "Cardiac Arrest",
      aadhaarNumber: "4930-1829-3810",
      uidaiOfficeName: "UIDAI Regional Office Chandigarh",
      uidaiOfficeAddress: "Sector 17, Chandigarh",
      revenueOfficeName: "Tahsildar Revenue Office",
      revenueOfficeAddress: "Chandigarh Admin Sector 9",
      legalHeirs: [
        { name: "Savitri Devi", age: "68", relationship: "Wife", occupation: "Homemaker" },
        { name: "Amit Kumar", age: "40", relationship: "Son", occupation: "Software Engineer" }
      ]
    };
  } else {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Select and compile the appropriate document for the task: "${task.title}".`
          }
        ]
      });

      const rawJson = response.content[0].text;
      const result = JSON.parse(rawJson.trim());
      selectedTemplate = result.template;
      filledFields = result.fields;
    } catch (err) {
      if (err.message?.includes("balance") || err.message?.includes("credit")) {
        console.warn("Anthropic API key has zero balance. Falling back to Mock mode.");
        process.env.MOCK_AI = "true";
        return runDocumentAgent(userId, taskId, documentType, additionalContext);
      }
      console.error("Failed to compile document:", err);
      throw new Error("Invalid response structure from Document Agent model.");
    }
  }

  // Add standard automatic fields
  if (!filledFields.currentDate) {
    filledFields.currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  // Generate output filename
  const filename = `${selectedTemplate}_${taskId.substring(0, 8)}.pdf`;

  // 4. Generate the PDF file
  const relativePdfUrl = await generateDocument(selectedTemplate, filledFields, filename);

  // 5. Save document record in database
  const document = await prisma.document.create({
    data: {
      title: `${task.title} - Draft Request`,
      type: selectedTemplate,
      status: "DRAFT",
      content: filledFields,
      fileUrl: relativePdfUrl,
      taskId: task.id,
      userId: user.id
    }
  });

  // 6. Update task status if it was pending
  await prisma.task.update({
    where: { id: taskId },
    data: { status: "IN_PROGRESS" }
  });

  return {
    documentId: document.id,
    template: selectedTemplate,
    fileUrl: relativePdfUrl,
    fields: filledFields
  };
}
