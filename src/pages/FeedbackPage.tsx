import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackSmiley from '../components/FeedbackSmiley';
import { useActiveQuestion } from '../hooks/useActiveQuestion';
import { useResponses } from '../hooks/useResponses';
import { useQuestions } from '../hooks/useQuestions';

const FeedbackPage: React.FC = () => {
  const { questions } = useQuestions();
  const { submitResponse } = useResponses();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug log
  useEffect(() => {
    console.log('Questions in FeedbackPage:', questions);
    console.log('Current index:', currentQuestionIndex);
    console.log('Current question:', questions[currentQuestionIndex]);
  }, [questions, currentQuestionIndex]);

  const handleFeedback = async (rating: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      setSubmitting(true);
      
      await submitResponse({
        question_id: currentQuestion.id,
        rating: rating > 0 ? 1 : -1
      });

      if (currentQuestionIndex === questions.length - 1) {
        setSubmitted(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }

    } catch (err) {
      console.error('Full feedback error:', err);
      setError('Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

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
                  {questions[currentQuestionIndex].question_text}
                </h2>
                
                <div className="flex justify-center space-x-8 mt-8">
                  <FeedbackSmiley 
                    isHappy={true} 
                    onClick={() => handleFeedback(1)} 
                  />
                  <FeedbackSmiley 
                    isHappy={false} 
                    onClick={() => handleFeedback(-1)} 
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