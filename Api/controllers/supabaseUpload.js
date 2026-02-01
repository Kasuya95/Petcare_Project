// supabaseUpload.js (backend)
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImageToSupabase(fileBuffer, fileName, mimetype) {
  const filePath = `service-Service/${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from('Service').upload(filePath, fileBuffer, {
    contentType: mimetype,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('Service').getPublicUrl(filePath);
  return data.publicUrl;
}

module.exports = { uploadImageToSupabase };