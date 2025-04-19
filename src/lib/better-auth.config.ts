/**
 * This file is used to configure the BetterAuth library.
 * It is never imported anywhere on a serverless setup.
 */

import { createDb } from "@/db";
import env from "@/env-runtime";
import { configureAuth } from "@/lib/auth";

const { db } = createDb(env);

export const auth = configureAuth(db);
