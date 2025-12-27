import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { IncidentType, Severity, IncidentStatus } from '../types';

/**
 * SQL SCHEMA SETUP:
 * 
 * 1. Create a table named 'incidents'
 * 2. Columns:
 *    - id (uuid, primary key, default: uuid_generate_v4())
 *    - created_at (timestamptz, default: now())
 *    - type (text)
 *    - description (text)
 *    - severity (text)
 *    - status (text, default: 'Unverified')
 *    - lat (float8)
 *    - lng (float8)
 *    - address (text, nullable)
 *    - image_url (text, nullable)
 *    - upvotes (int8, default: 0)
 *    - upvoted_by (text[], default: {})
 * 
 * 3. Create a Storage Bucket named 'incident-evidence' with public access.
 */

interface CreateIncidentData {
  type: IncidentType;
  description: string;
  severity: Severity;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  imageFile: File | null;
}

export const useCreateIncident = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createIncident = async (data: CreateIncidentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = null;

      // 1. Upload Image if exists
      if (data.imageFile) {
        const fileExt = data.imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('incident-evidence')
          .upload(filePath, data.imageFile);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('incident-evidence')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 2. Insert Record into Database
      // Note: We map frontend CamelCase to DB snake_case here
      const { error: insertError } = await supabase
        .from('incidents')
        .insert([
          {
            type: data.type,
            description: data.description,
            severity: data.severity,
            status: IncidentStatus.UNVERIFIED,
            lat: data.location.lat,
            lng: data.location.lng,
            address: data.location.address,
            image_url: imageUrl,
            upvotes: 0,
            upvoted_by: []
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      console.error('Error creating incident:', err);
      setError(err.message || 'Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return {
    createIncident,
    loading,
    error,
    success
  };
};
