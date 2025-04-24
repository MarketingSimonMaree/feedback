import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/supabase';

type Question = Database['feedback']['Tables']['questions']['Row'];

export const useActiveQuestion = () => {
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback_questions')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: true }); // Oudste eerst

      if (error) throw error;

      setActiveQuestions(data || []);
      setCurrentQuestionIndex(0);
    } catch (err: any) {
      console.error('Error fetching active questions:', err);
      setError(err.message || 'Failed to fetch active questions');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchActiveQuestions();
    
    const subscription = supabase
      .channel('feedback_questions_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'feedback', 
        table: 'questions' 
      }, () => {
        fetchActiveQuestions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    activeQuestion: activeQuestions[currentQuestionIndex] || null,
    hasNextQuestion: currentQuestionIndex < activeQuestions.length - 1,
    nextQuestion,
    loading,
    error,
    refresh: fetchActiveQuestions
  };
};