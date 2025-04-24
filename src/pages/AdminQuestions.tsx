import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import Header from '../components/Header';
import QuestionForm from '../components/QuestionForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const AdminQuestions = () => {
  const { questions, createQuestion, updateQuestion, deleteQuestion, reorderQuestions, saveOrder } = useQuestions();
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderQuestions(result.source.index, result.destination.index);
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Questions</h1>
          <div className="flex space-x-4">
            {hasChanges && (
              <button
                onClick={async () => {
                  await saveOrder(questions);
                  setHasChanges(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2"
              >
                Volgorde opslaan
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2"
            >
              <span>+</span>
              <span>New Question</span>
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Beheer Vragen ({questions.length})</h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <Draggable 
                    key={question.id} 
                    draggableId={question.id.toString()} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={question.active}
                              onChange={(e) => updateQuestion(question.id, question.question_text, e.target.checked)}
                              className="form-checkbox"
                            />
                            <span>Actief</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingQuestion(question.id);
                                setEditText(question.question_text);
                              }}
                              className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              Bewerk
                            </button>
                            <button
                              onClick={() => deleteQuestion(question.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Verwijder
                            </button>
                          </div>
                        </div>
                        {editingQuestion === question.id ? (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border rounded"
                            />
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => {
                                  updateQuestion(question.id, editText, question.active);
                                  setEditingQuestion(null);
                                }}
                                className="bg-green-500 text-white px-3 py-1 rounded"
                              >
                                Opslaan
                              </button>
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded"
                              >
                                Annuleren
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2">{question.question_text}</p>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {showForm && (
          <QuestionForm
            onClose={() => setShowForm(false)}
            onSubmit={async (questionText) => {
              await createQuestion(questionText);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;