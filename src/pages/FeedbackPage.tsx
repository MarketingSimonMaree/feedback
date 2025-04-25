import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackSmiley from '../components/FeedbackSmiley';
import { useActiveQuestion } from '../hooks/useActiveQuestion';
import { useResponses } from '../hooks/useResponses';
import { useQuestions } from '../hooks/useQuestions';
import { supabase } from '../lib/supabaseClient';

const FeedbackPage = ({ type }: { type: string }) => {
  const { questions } = useQuestions();
  const { submitResponse } = useResponses();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionsFromSupabase, setQuestionsFromSupabase] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Debug log
  useEffect(() => {
    console.log('Questions in FeedbackPage:', questions);
    console.log('Current index:', currentQuestionIndex);
    console.log('Current question:', questions[currentQuestionIndex]);
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('feedback_questions')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching questions:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched questions:', data); // Debug log
      setQuestionsFromSupabase(data || []);
    };

    fetchQuestions();
  }, []);

  // Log wanneer questions verandert
  useEffect(() => {
    console.log('Questions state updated:', questionsFromSupabase);
  }, [questionsFromSupabase]);

  const handleFeedback = async (feedback: any) => {
    try {
      // Bepaal het juiste type op basis van de URL
      const responseType = type === 'winkel' ? 'winkel' : 'timmerman';

      const { error } = await supabase
        .from('feedback_responses')
        .insert([
          {
            question_id: questions[currentQuestionIndex].id,
            ...feedback,
            response_type: responseType  // Gebruik het juiste type
          }
        ]);

      if (error) throw error;

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Laatste vraag is beantwoord
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Full feedback error:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No active questions at the moment.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Bedankt voor je feedback!</h2>
          <p className="text-gray-600">We waarderen je mening en gebruiken deze om onze service te verbeteren.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Simon Maree Feedback</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full mx-auto">
          <div className="text-center text-gray-600 text-lg font-semibold mb-12 mt-8">
            Dit is volledig anoniem.<br />
            Want we willen graag jouw feedback!
          </div>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 text-center shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-4">Bedankt!</h2>
                <p className="text-gray-700">Jouw feedback is anoniem verzonden.</p>
              </motion.div>
            ) : submitting ? (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 text-center shadow-lg"
              >
                <p className="text-gray-700">Submitting feedback...</p>
              </motion.div>
            ) : !questions.length ? (
              <motion.div
                key="no-questions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-8 text-center shadow-lg"
              >
                <p className="text-gray-700">No active questions at the moment.</p>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 shadow-lg"
              >
                <h2 className="text-xl font-bold mb-6 text-center">
                  {currentQuestion.question_text}
                </h2>
                
                <div className="flex justify-center space-x-8 mt-8">
                  <FeedbackSmiley 
                    isHappy={true} 
                    onClick={() => handleFeedback({ is_happy: true })} 
                  />
                  <FeedbackSmiley 
                    isHappy={false} 
                    onClick={() => handleFeedback({ is_happy: false })} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-black text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Simon Maree. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackPage;
