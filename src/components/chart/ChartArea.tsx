"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { SignalCanvas } from './SignalCanvas';
import { ColumnOverlay } from './ColumnOverlay';
import { useSimulatorStore } from '@/store/simulatorStore';
import { useUIStore } from '@/store/uiStore';

export const ChartArea: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  
  const { addColumn, triggerDistortion, clearDistortion } = useSimulatorStore();
  const { selectedTab } = useUIStore();

  const tabs = ['Arm', 'Chart 2', 'Finger Cuff Detrend Example', 'Finger Part II', 'Finger Part III', 'Chart 6'];

  const handleResize = useCallback(() => {
    const container = document.getElementById('chart-container');
    if (container) {
      setDimensions({
        width: container.clientWidth - 40,
        height: container.clientHeight - 60,
      });
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    // Calculate time position relative to current time
    const timeScale = dimensions.width / 60; // 60 seconds window
    const timeOffset = (dimensions.width - x) / timeScale; // Time offset from current time (inverted)
    const currentTime = useSimulatorStore.getState().getCurrentTime();
    const absoluteTime = currentTime - timeOffset; // Absolute time position
    
    // Add column based on click type
    if (event.button === 0) { // Left click - green column
      addColumn({
        type: 'green',
        x: absoluteTime,
        width: 3, // 3 seconds width
        timestamp: Date.now(),
      });
    } else if (event.button === 2) { // Right click - red column
      addColumn({
        type: 'red',
        x: absoluteTime,
        width: 3, // 3 seconds width
        timestamp: Date.now(),
      });
    }
    
    setIsDragging(false);
  }, [isDragging, dimensions.width, addColumn]);

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      triggerDistortion();
      setTimeout(() => clearDistortion(), 1000);
    }
  }, [triggerDistortion, clearDistortion]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === tab
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => useUIStore.getState().setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div
        id="chart-container"
        className="flex-1 relative overflow-hidden"
        style={{ minHeight: '400px' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="absolute inset-0 p-4">
          <SignalCanvas
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
          />
          <ColumnOverlay width={dimensions.width} height={dimensions.height} />
        </div>
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl font-bold text-gray-200 opacity-20 select-none">
            CPSpro
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center space-x-6">
          <span>Left-click: Add green column</span>
          <span>Right-click: Add red column</span>
          <span>Spacebar: Trigger signal distortion</span>
        </div>
      </div>
    </div>
  );
};
