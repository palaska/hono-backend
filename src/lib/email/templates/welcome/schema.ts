import { z } from "zod";

import en from "./en.hbs?raw";

export const templates: { [lang: string]: string } = {
  en,
};

export const schema = z.object({
  name: z.string(),
  verificationUrl: z.string().optional(),
  year: z.number().default(new Date().getFullYear()),
});
