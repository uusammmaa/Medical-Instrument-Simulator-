'use client';

import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';

export const Sidebar: React.FC = () => {
  const {
    scoring,
    question,
    comments,
    ratios,
    totals,
    conclusion,
    updateScoring,
    updateQuestion,
    updateComments,
    setConclusion,
  } = useUIStore();

  const conclusionOptions = [
    { value: 'Not Scored', label: 'Not Scored' },
    { value: 'Deceptive', label: 'Deceptive' },
    { value: 'Non-Deceptive', label: 'Non-Deceptive' },
    { value: 'Inconclusive', label: 'Inconclusive' },
  ];

  return (
    <aside
      className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto"
    >
      <div className="p-4 space-y-6">
        {/* Numerical Scoring */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Numerical Scoring</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div></div>
              <div className="text-center font-medium">R1</div>
              <div className="text-center font-medium">R2</div>
            </div>
            
            {['tr', 'ar', 'eda', 'bp', 'ple'].map((field) => (
              <div key={field} className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm font-medium text-gray-700 uppercase">{field}</div>
                <Input
                  type="number"
                  value={scoring.r1[field as keyof typeof scoring.r1]}
                  onChange={(value) => updateScoring({
                    r1: { ...scoring.r1, [field]: parseFloat(value) || 0 }
                  })}
                  className="text-center"
                />
                <Input
                  type="number"
                  value={scoring.r2[field as keyof typeof scoring.r2]}
                  onChange={(value) => updateScoring({
                    r2: { ...scoring.r2, [field]: parseFloat(value) || 0 }
                  })}
                  className="text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question - R1</h3>
          <div className="space-y-3">
            <Input
              value={question.question}
              onChange={(value) => updateQuestion({ question: value })}
              placeholder="Enter question here..."
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={question.r1}
                onChange={(value) => updateQuestion({ r1: value })}
                placeholder="R1"
              />
              <Input
                value={question.r2}
                onChange={(value) => updateQuestion({ r2: value })}
                placeholder="R2"
              />
            </div>
          </div>
        </div>

        {/* EDA Comments */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">EDA Comments</h3>
          <textarea
            value={comments.edaComments}
            onChange={(e) => updateComments({ edaComments: e.target.value })}
            placeholder="Your comments go here"
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
          />
        </div>

        {/* EDA Ratios */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">EDA Ratios</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div></div>
              <div className="text-center font-medium">R1</div>
              <div className="text-center font-medium">R2</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-sm font-medium text-gray-700">C1</div>
              <div className="text-center text-sm bg-gray-100 py-2 rounded">{ratios.c1.r1}</div>
              <div className="text-center text-sm bg-gray-100 py-2 rounded">{ratios.c1.r2}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-sm font-medium text-gray-700">C2</div>
              <div className="text-center text-sm bg-gray-100 py-2 rounded">{ratios.c2.r1}</div>
              <div className="text-center text-sm bg-gray-100 py-2 rounded">{ratios.c2.r2}</div>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Totals</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center font-medium">R1</div>
            <div className="text-center font-medium">R2</div>
            <div className="text-center font-medium">Total</div>
            <div className="text-center text-sm bg-gray-100 py-2 rounded">{totals.r1}</div>
            <div className="text-center text-sm bg-gray-100 py-2 rounded">{totals.r2}</div>
            <div className="text-center text-sm bg-gray-100 py-2 rounded">{totals.total}</div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conclusion</h3>
          <Dropdown
            options={conclusionOptions}
            value={conclusion}
            onChange={setConclusion}
            placeholder="Select conclusion"
          />
        </div>
      </div>
    </aside>
  );
};
