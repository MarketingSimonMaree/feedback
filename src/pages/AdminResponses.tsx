import React from 'react';
import Header from '../components/Header';

const AdminResponses = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ingediende Feedback</h1>
        </div>
        <p>Test - Als je dit ziet, werkt de basis component</p>
      </div>
    </div>
  );
};

export default AdminResponses; 