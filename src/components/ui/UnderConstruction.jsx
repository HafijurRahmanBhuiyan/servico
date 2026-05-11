import React from 'react';
import { Settings } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-indigo-600 p-6 rounded-full">
              <Settings className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Under Construction
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          We're working hard to bring you something amazing
        </p>

        <div className="inline-block bg-indigo-50 rounded-lg px-6 py-3 border border-indigo-200">
          <p className="text-indigo-700 font-medium">
            This page is currently being built
          </p>
        </div>
      </div>
    </div>
  );
}