'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSimulatorStore } from '@/store/simulatorStore';

interface ColumnOverlayProps {
  width: number;
  height: number;
}

export const ColumnOverlay: React.FC<ColumnOverlayProps> = ({ width, height }) => {
  const { columns, removeColumn } = useSimulatorStore();

  const handleColumnClick = (columnId: string) => {
    removeColumn(columnId);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`absolute pointer-events-auto cursor-pointer ${
            column.type === 'green' ? 'bg-green-500' : 'bg-red-500'
          } bg-opacity-30 border-2 ${
            column.type === 'green' ? 'border-green-500' : 'border-red-500'
          } hover:bg-opacity-50 transition-all duration-200`}
          style={{
            left: `${(column.x / 180) * 100}%`,
            width: `${(column.width / 180) * 100}%`,
            height: '100%',
          }}
          onClick={() => handleColumnClick(column.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute top-2 left-2 text-xs font-bold text-white bg-black bg-opacity-50 px-1 rounded">
            {column.type === 'green' ? 'G' : 'R'}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
