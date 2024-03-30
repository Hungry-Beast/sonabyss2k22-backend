const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const supabase = createClient(
  "https://lkefjyhyetaykbxencgg.supabase.co",
  process.env.SUPABASE_KEY
);

module.exports = supabase;
