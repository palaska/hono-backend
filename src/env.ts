/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

import { EmailEnvSchema } from "@/lib/email";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".dev.vars.test" : ".dev.vars",
  ),
}));

// Define base environment schema
const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  // Email service feature flag
  EMAIL_SERVICE_ENABLED: z.string()
    .default("false")
    .transform(val => val === "true" || val === "1"),
  // Email configuration (only required if EMAIL_SERVICE_ENABLED is true)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
}).superRefine((input, ctx) => {
  if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: "undefined",
      path: ["DATABASE_AUTH_TOKEN"],
      message: "Must be set when NODE_ENV is 'production'",
    });
  }

  if (input.NODE_ENV === "production" && !input.JWT_SECRET) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: "undefined",
      path: ["JWT_SECRET"],
      message: "Must be set when NODE_ENV is 'production'",
    });
  }

  // Validate email configuration if email service is enabled
  if (input.EMAIL_SERVICE_ENABLED) {
    ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"].forEach((field) => {
      if (!input[field as keyof typeof input]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "Required when EMAIL_SERVICE_ENABLED is true",
        });
      }
    });
  }
});

export type Environment = z.infer<typeof EnvSchema>;

export function parseEnv(data: any) {
  const { data: env, error } = EnvSchema.safeParse(data);

  if (error) {
    const errorMessage = `❌ Invalid env - ${Object.entries(error.flatten().fieldErrors).map(([key, errors]) => `${key}: ${errors.join(",")}`).join(" | ")}`;
    throw new Error(errorMessage);
  }

  return env;
}
