import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzneigqfuxkajgrevumr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bmVpZ3FmdXhrYWpncmV2dW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMjg1ODYsImV4cCI6MjA0NzYwNDU4Nn0.7hgfoatKbZCGhKxDHJFewnr_8xACUTXYeoe0RsB0m0U';

export const supabase = createClient(supabaseUrl, supabaseKey);