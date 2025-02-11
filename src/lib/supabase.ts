import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgchmjqxxlpqvydzmmhv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnY2htanF4eGxwcXZ5ZHptbWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyODEwNDksImV4cCI6MjA1NDg1NzA0OX0.10dV-lXApfd1hWAPAHytFX68f1RuUNgBRdHaNMUWvqw';

export const supabase = createClient(supabaseUrl, supabaseKey);
