import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
  status: baseProcedure.query(async () => {
    try {
      const result = await getUsageStatus();
      return result;
    } catch {
      return null;
    }
  })
});

