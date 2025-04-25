import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { z } from "zod";

import type { Environment } from "@/env";

import { schema as welcomeSchema, templates as welcomeTemplates } from "./templates/welcome/schema";

const SUBJECT_END_MARKER = "===SUBJECT END===";

// Email configuration schema - will be validated when environment variables are parsed
export const EmailEnvSchema = z.object({
  SMTP_HOST: z.string().default("smtp.example.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default("noreply@example.com"),
});

export type EmailConfig = z.infer<typeof EmailEnvSchema>;

// State for lazy initialization
let isInitialized = false;
let transporter: nodemailer.Transporter | null = null;
let emailFrom = "";

/**
 * Initialize the email service with environment
 */
export function initEmailService(env: Environment) {
  try {
    if (isInitialized) {
      return;
    }

    isInitialized = true;

    // Check if email service is enabled via feature flag
    if (!env.EMAIL_SERVICE_ENABLED) {
      console.info("Email service disabled via EMAIL_SERVICE_ENABLED=false");
      return;
    }

    // At this point, we know EMAIL_SERVICE_ENABLED is true
    // and environment validation ensures all required fields are present
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST!,
      port: env.SMTP_PORT || 587,
      secure: (env.SMTP_PORT || 587) === 465,
      auth: {
        user: env.SMTP_USER!,
        pass: env.SMTP_PASS!,
      },
    });

    emailFrom = env.EMAIL_FROM!;
    console.info("Email service initialized successfully");
  }
  catch (error) {
    console.error("Failed to initialize email service:", error);
  }
}

/**
 * Check if email service is properly configured
 */
export function isEmailServiceEnabled(): boolean {
  return isInitialized && transporter !== null;
}

/**
 * Read and compile an email template
 */
function compileTemplate<T>(
  templateName: string,
  lang: string,
  data: T,
): string {
  const templateSource = welcomeTemplates[lang];
  const template = handlebars.compile(templateSource);
  return template(data);
}

/**
 * Email sending error
 */
export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

/**
 * Send an email
 */
function sendTemplatizedEmailFn<T extends z.ZodSchema>(
  templateName: string,
  schema: T,
) {
  return async ({ to, lang, data }: { to: string | string[]; lang: string; data: z.infer<T> }) => {
    if (!isInitialized) {
      throw new EmailError("Email service not initialized");
    }

    if (!transporter) {
      console.warn(`Email service not configured. Skipping sending email "${templateName}"`);
      return;
    }

    // Validate data against schema
    try {
      schema.parse(data);
    }
    catch (error) {
      throw new EmailError(`Invalid data for template ${templateName}: ${error}`);
    }

    // Compile template with data
    const compiled = compileTemplate(templateName, lang, data);

    const [subject, html] = compiled.split(SUBJECT_END_MARKER);

    try {
      await transporter.sendMail({
        from: emailFrom,
        to,
        subject,
        html,
      });
    }
    catch (error) {
      throw new EmailError(`Failed to send email: ${error}`);
    }
  };
}

// Create the sendEmail object with properly typed methods
export const sendEmail = {
  welcome: sendTemplatizedEmailFn("welcome", welcomeSchema),
};
