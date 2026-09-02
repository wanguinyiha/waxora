import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = "admin@waxora.com";
const ADMIN_PASSWORD = "WaxoraAdmin1!";

async function seed() {
  console.log("Creating demo admin user...");

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already exists")) {
      console.log(`User ${ADMIN_EMAIL} already exists — skipping auth creation.`);
    } else {
      console.error("Auth error:", authError.message);
      process.exit(1);
    }
  } else {
    console.log(`Auth user created: ${authData.user.id}`);

    const { error: adminError } = await supabase.from("admins").insert({
      id: authData.user.id,
      email: ADMIN_EMAIL,
    });

    if (adminError) {
      console.error("Admin insert error:", adminError.message);
      process.exit(1);
    }

    console.log("Admin record created.");
  }

  console.log("\n--- Demo Credentials ---");
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log("------------------------\n");
}

seed();
