import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./db";

const FREE_POINTS = 1000; // Increased limit since no auth
const DURATION = 30 * 24 * 60 *60;  //30 days
const GENERATION_COST = 1;
const DEFAULT_USER_ID = "anonymous"; // Default user for no-auth mode

export async function getUsageTracker() {
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
};

export async function consumeCredits () {
  const userId = DEFAULT_USER_ID;

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);
  return result;
};

export async function getUsageStatus() {
  const userId = DEFAULT_USER_ID;

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}