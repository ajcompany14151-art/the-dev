import prisma from "./db";

/**
 * Check if database is properly configured and accessible
 */
export async function checkDatabaseConnection() {
  try {
    // Simple connection test
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, message: "Database connected successfully" };
  } catch (error) {
    console.error("Database connection failed:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown database error" 
    };
  }
}

/**
 * Check if required environment variables are set
 */
export function checkEnvironmentVariables() {
  const missing = [];
  
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "your_database_url_here") {
    missing.push("DATABASE_URL");
  }
  
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    missing.push("GEMINI_API_KEY or OPENAI_API_KEY");
  }
  
  if (!process.env.E2B_API_KEY || process.env.E2B_API_KEY === "your_e2b_api_key_here") {
    missing.push("E2B_API_KEY");
  }
  
  return {
    success: missing.length === 0,
    missing,
    message: missing.length > 0 
      ? `Missing required environment variables: ${missing.join(", ")}` 
      : "All environment variables configured"
  };
}