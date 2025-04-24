import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Question {
  id: number;
  question_text: string;
  active: boolean;
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('feedback_questions')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    setQuestions(data || []);
  };

  const createQuestion = async (questionText: string) => {
    console.log('Creating question:', questionText);
    const { data, error } = await supabase
      .from('feedback_questions')
      .insert([{ question_text: questionText, active: true }])
      .select();

    if (error) {
      console.error('Error creating question:', error);
      throw error;
    }

    console.log('Created question:', data);
    await fetchQuestions();
    return data;
  };

  const updateQuestion = async (id: number, questionText: string, active: boolean) => {
    console.log('Updating question:', { id, questionText, active });
    const { data, error } = await supabase
      .from('feedback_questions')
      .update({ question_text: questionText, active })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating question:', error);
      throw error;
    }

    console.log('Updated question:', data);
    await fetchQuestions();
    return data;
  };

  const deleteQuestion = async (id: number) => {
    console.log('Deleting question:', id);
    const { error } = await supabase
      .from('feedback_questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting question:', error);
      throw error;
    }

    console.log('Deleted question:', id);
    await fetchQuestions();
  };

  const reorderQuestions = async (startIndex: number, endIndex: number) => {
    const newQuestions = Array.from(questions);
    const [removed] = newQuestions.splice(startIndex, 1);
    newQuestions.splice(endIndex, 0, removed);
    setQuestions(newQuestions);
  };

  const saveOrder = async (orderedQuestions: any[]) => {
    try {
      const updates = orderedQuestions.map((question, index) => ({
        id: question.id,
        display_order: index + 1,
        question_text: question.question_text,
        active: question.active
      }));

      const { error } = await supabase
        .from('feedback_questions')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      await fetchQuestions();
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    saveOrder,
  };
};