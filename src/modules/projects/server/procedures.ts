import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { 
  createTRPCRouter, 
  baseProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const projectsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, {message: "Project ID is required"}),
      }),
    )
    .query(async({ input, ctx }) => {
      try {
        const exsitingProject = await prisma.project.findUnique({
          where: {
            id: input.id,
            userId: ctx.userId,
          },
        });

        if (!exsitingProject) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
        }
        
        return exsitingProject;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Database error in getOne:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Database connection failed. Please check your DATABASE_URL environment variable." 
        });
      }
    }),

  getMany: baseProcedure
    .query(async ({ ctx }) => {
      try {
        const projects = await prisma.project.findMany({
          where: {
            userId: ctx.userId,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
        
        return projects;
      } catch (error) {
        console.error('Database error in getMany:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Database connection failed. Please check your DATABASE_URL environment variable." 
        });
      }
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string()
          .min(1, "Prompt cannot be empty")
          .max(1000, "Prompt cannot be longer than 1000 characters"),
        model: z.enum(["grok", "codex", "gemini"])
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Check database connection first
        if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "your_database_url_here") {
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: "Database not configured. Please set DATABASE_URL environment variable." 
          });
        }

        try {
          await consumeCredits();
        } catch (error) {
          if (error instanceof Error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
          } else {
            throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have reached your limit of requests" });
          }
        }

        const createdProject = await prisma.project.create({
          data: {
            userId: ctx.userId,
            name: generateSlug(2, { format: "kebab" }),
            messages: {
              create: {
                content: input.value,
                role: "USER",
                type: "RESULT",
              }
            }
          }
        });

        // Check if required API keys are configured
        if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: "AI API not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY." 
          });
        }

        await inngest.send({
          name: "code-agent/run",
          data: { 
              value: input.value,
              projectId: createdProject.id,
              model: input.model
          },
        });

        return createdProject;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Database error in create:', error);
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Failed to create project. Please check your database configuration." 
        });
      }
    }),
});
