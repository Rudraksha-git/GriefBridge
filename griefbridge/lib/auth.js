/**
 * Helper to safely retrieve the authenticated user's ID.
 * Falls back to "user_demo" if auth() fails, is called outside a request context, 
 * or if no user is signed in (for hackathon demo/testing purposes).
 * 
 * Uses dynamic import to prevent Node.js ESM compilation/resolution errors 
 * when running standalone scripts offline.
 * 
 * @returns {Promise<string>} The user ID or "user_demo"
 */
export async function getUserId() {
  try {
    // Dynamically import Clerk server helpers inside the try-catch block.
    // This allows offline/test scripts running directly in Node ESM to 
    // catch any internal Clerk import resolution errors and safely fall back.
    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();
    return userId || "user_demo";
  } catch (error) {
    // Fall back to demo user when Clerk context is missing or fail to import offline
    return "user_demo";
  }
}
