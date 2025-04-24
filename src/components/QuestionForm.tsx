import React, { useState } from 'react';
import AngularButton from './AngularButton';

interface QuestionFormProps {
  initialData?: {
    id: number;
    question_text: string;
    active: boolean;
  };
  onSubmit: (data: { question_text: string; active: boolean }) => Promise<void>;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [questionText, setQuestionText] = useState(initialData?.question_text || '');
  const [isActive, setIsActive] = useState(initialData?.active ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        question_text: questionText,
        active: isActive,
      });
    } catch (err) {
      setError('Failed to save question. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-300">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Edit Question' : 'Create New Question'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="question_text" className="block text-gray-700 mb-2 font-medium">
          Question Text
        </label>
        <textarea
          id="question_text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none"
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            className="mr-2 h-5 w-5 text-black focus:ring-0"
            disabled={isSubmitting}
          />
          <span className="text-gray-700 font-medium">Question is active</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-3">
        <AngularButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </AngularButton>
        <AngularButton
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Question'}
        </AngularButton>
      </div>
    </form>
  );
};

export default QuestionForm;