import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile(name: string): Record<string, string> {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) return {};
  const values: Record<string, string> = {};
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    values[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
  return values;
}

const fileEnv = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
const env = (key: string): string | undefined =>
  process.env[key] ?? fileEnv[key];

const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
const adminEmail = env("SEED_ADMIN_EMAIL");
const adminPassword = env("SEED_ADMIN_PASSWORD");

const missing = [
  !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
  !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
  !adminEmail && "SEED_ADMIN_EMAIL",
  !adminPassword && "SEED_ADMIN_PASSWORD",
].filter(Boolean);

if (missing.length > 0) {
  console.error(`Missing: ${missing.join(", ")}`);
  console.error("Set them in .env / .env.local (see .env.example).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log("Creating admin user...");

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail!,
    password: adminPassword!,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already exists")) {
      console.log(`User ${adminEmail} already exists — skipping auth creation.`);
    } else {
      console.error("Auth error:", authError.message);
      process.exit(1);
    }
  } else {
    console.log(`Auth user created: ${authData.user.id}`);

    const { error: adminError } = await supabase.from("admins").insert({
      id: authData.user.id,
      email: adminEmail,
    });

    if (adminError) {
      console.error("Admin insert error:", adminError.message);
      process.exit(1);
    }

    console.log("Admin record created.");
  }
}

seed();
