import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface FeedbackResponse {
  id: number;
  created_at: string;
  question_id: number;
  is_happy: boolean;
  rating: number;
  response_type: string;
}

export const useResponses = () => {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);

  const fetchResponses = async () => {
    const { data, error } = await supabase
      .from('feedback_responses')
      .select(`
        *,
        feedback_questions(question_text)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching responses:', error);
      return;
    }

    setResponses(data || []);
  };

  const deleteResponse = async (id: number) => {
    try {
      const { error } = await supabase
        .from('feedback_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchResponses();
    } catch (error) {
      console.error('Error deleting response:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return {
    responses,
    deleteResponse,
  };
};