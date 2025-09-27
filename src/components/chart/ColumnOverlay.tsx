'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSimulatorStore } from '@/store/simulatorStore';

interface ColumnOverlayProps {
  width: number;
  height: number;
}

export const ColumnOverlay: React.FC<ColumnOverlayProps> = ({ width }) => {
  const { columns, removeColumn, getCurrentTime } = useSimulatorStore();

  const handleColumnClick = (columnId: string) => {
    removeColumn(columnId);
  };

  const currentTime = getCurrentTime();
  const timeScale = width / 60; // 60 seconds window

  return (
    <div className="absolute inset-0 pointer-events-none">
      {columns.map((column) => {
        // Calculate position relative to current time window
        const timeOffset = currentTime - column.x;
        const x = width - (timeOffset * timeScale);
        const columnWidth = (column.width * timeScale) * 0.2; // Make columns 50% thinner
        
        // Only render if column is visible in current time window
        if (x + columnWidth > 0 && x < width) {
          return (
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
                left: `${x}px`,
                width: `${columnWidth}px`,
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
          );
        }
        return null;
      })}
    </div>
  );
};
