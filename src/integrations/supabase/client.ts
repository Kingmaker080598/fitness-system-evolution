// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oiufgxtaehrwqnqmkhhc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pdWZneHRhZWhyd3FucW1raGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDc0MDAsImV4cCI6MjA1NzcyMzQwMH0.lDOXp643LdqP4xsj_fZxDQSSeKX2UpoexK06WJnjJ2Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);