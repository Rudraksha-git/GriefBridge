import fs from "fs";
import path from "path";

/**
 * Reads and returns the institution registry from the JSON data file.
 * @returns {Array} List of institutions
 */
export function getInstitutionRegistry() {
  const filePath = path.join(process.cwd(), "data", "institutionRegistry.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Institution registry file not found at ${filePath}`);
  }
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

/**
 * Drafts a formal notification letter text based on the institution type and provided details.
 * @param {string} institutionType - 'bank' | 'insurance' | 'government' | 'utility' | 'digital' | 'employer'
 * @param {object} deceasedDetails - { name, dateOfDeath, relationshipToClaimant, deathCertificateNo }
 * @param {object} claimantDetails - { name, phone, email, address }
 * @param {object} extraDetails - Extra keys like policyNumber, accountNumber, connectionNumber, employeeId
 * @returns {string} Fully formatted text letter
 */
export function draftNotificationLetter(institutionType, deceasedDetails, claimantDetails, extraDetails = {}) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const deceased = {
    name: deceasedDetails.name || "[Deceased Name]",
    dateOfDeath: deceasedDetails.dateOfDeath || "[Date of Death]",
    relationship: deceasedDetails.relationshipToClaimant || "relative",
    deathCertificateNo: deceasedDetails.deathCertificateNo || "[Death Certificate No]",
  };

  const claimant = {
    name: claimantDetails.name || "[Claimant Name]",
    phone: claimantDetails.phone || "[Claimant Phone]",
    email: claimantDetails.email || "[Claimant Email]",
    address: claimantDetails.address || "[Claimant Address]",
  };

  const lines = [
    `Date: ${currentDate}`,
    "",
    "To,",
    "The Authorized Officer / Customer Support Team,",
    extraDetails.institutionName ? extraDetails.institutionName : "The Institution Manager,",
    "",
  ];

  switch (institutionType) {
    case "bank": {
      const accNo = extraDetails.accountNumber || "[Account Number]";
      lines.push(
        `Subject: Notification of demise of account holder and request for account status verification (Acc No: ${accNo})`,
        "",
        "Dear Sir/Madam,",
        "",
        `I am writing to formally notify you of the sad demise of my ${deceased.relationship}, ${deceased.name}, who passed away on ${deceased.dateOfDeath}. The deceased held a bank account under Account Number: ${accNo} with your institution.`,
        "",
        "I request you to temporarily freeze any debits from this account to prevent unauthorized transactions, verify the registered nominee status for this account, and guide me through the balance transfer / closure process.",
        "",
        `The official Death Certificate (No: ${deceased.deathCertificateNo}) is ready for your verification. Please let me know the official forms and documents required to initiate the claim/transfer.`,
        ""
      );
      break;
    }
    case "insurance": {
      const policyNo = extraDetails.policyNumber || "[Policy Number]";
      lines.push(
        `Subject: Demise notification and request for claim initiation for Policy No: ${policyNo}`,
        "",
        "Dear Sir/Madam,",
        "",
        `I am writing to notify you of the sad demise of my ${deceased.relationship}, ${deceased.name}, who was the insured policyholder under Life Insurance Policy Number: ${policyNo}. The deceased passed away on ${deceased.dateOfDeath}.`,
        "",
        "As the nominee/beneficiary of this policy, I request you to register this claim and send me the necessary claim settlement forms and list of supporting documentation required.",
        "",
        `Enclosed/available is the Death Certificate Registration No: ${deceased.deathCertificateNo} for registration of this notice.`,
        ""
      );
      break;
    }
    case "government": {
      const docNo = extraDetails.documentNumber || "[Document ID]";
      lines.push(
        `Subject: Notification of demise and request for update/cancellation of Record: ${docNo}`,
        "",
        "Dear Sir/Madam,",
        "",
        `I am writing to notify your office of the demise of my ${deceased.relationship}, ${deceased.name}, who passed away on ${deceased.dateOfDeath}. The deceased held document/record number: ${docNo} under your registry.`,
        "",
        "I request your office to update the status of this record to reflect the demise, or cancel/deactivate the credential to prevent misuse, as required by law.",
        "",
        `A copy of the Death Certificate (Certificate No: ${deceased.deathCertificateNo}) is provided for record verification.`,
        ""
      );
      break;
    }
    case "utility": {
      const connNo = extraDetails.connectionNumber || "[Connection/Consumer No]";
      lines.push(
        `Subject: Request for transfer / disconnection of Utility connection (No: ${connNo})`,
        "",
        "Dear Sir/Madam,",
        "",
        `I am writing to notify you of the demise of my ${deceased.relationship}, ${deceased.name}, who was the registered consumer for connection number ${connNo}. The deceased passed away on ${deceased.dateOfDeath}.`,
        "",
        "I request you to update your billing records and transfer this service connection to my name. I will clear any pending dues and complete the necessary transfer formalities.",
        "",
        `The Death Certificate No: ${deceased.deathCertificateNo} is attached for verification.`,
        ""
      );
      break;
    }
    case "digital": {
      const email = extraDetails.accountEmail || "[Account Email]";
      lines.push(
        `Subject: Demise notification and account closure request for account: ${email}`,
        "",
        "Dear Support Team,",
        "",
        `I am writing to notify you of the demise of my ${deceased.relationship}, ${deceased.name}, who passed away on ${deceased.dateOfDeath}. The deceased held an account on your platform registered under the email address: ${email}.`,
        "",
        "As the family representative, I request you to deactivate, delete, or memorialize this account, and cancel any recurring subscriptions or payments associated with it.",
        "",
        `Attached is the official Death Certificate (Certificate No: ${deceased.deathCertificateNo}) for verification of this request.`,
        ""
      );
      break;
    }
    case "employer": {
      const empId = extraDetails.employeeId || "[Employee ID]";
      lines.push(
        `Subject: Notification of demise and claim initiation for Employee ID: ${empId}`,
        "",
        "Dear HR Team,",
        "",
        `I am writing to notify you of the sad demise of my ${deceased.relationship}, ${deceased.name}, who was employed in your organization under Employee ID: ${empId}. The deceased passed away on ${deceased.dateOfDeath}.`,
        "",
        "I request you to initiate the final settlement process, including the release of pending salary, gratuity, provident fund, insurance benefits, and other dues, and guide me on the nominee verification procedure.",
        "",
        `The Death Certificate No: ${deceased.deathCertificateNo} is enclosed.`,
        ""
      );
      break;
    }
    default: {
      lines.push(
        `Subject: Notification of demise of ${deceased.name}`,
        "",
        "Dear Sir/Madam,",
        "",
        `I am writing to notify you of the sad demise of my ${deceased.relationship}, ${deceased.name}, who passed away on ${deceased.dateOfDeath}.`,
        "",
        "Please update your records to reflect this status and contact me if any formal procedures or settlements need to be executed.",
        ""
      );
      break;
    }
  }

  lines.push(
    "Thank you for your assistance during this difficult time.",
    "",
    "Sincerely yours,",
    "",
    "____________________________",
    claimant.name,
    `Relationship: ${deceased.relationship}`,
    `Phone: ${claimant.phone}`,
    `Email: ${claimant.email}`,
    `Address: ${claimant.address}`
  );

  return lines.join("\n");
}
