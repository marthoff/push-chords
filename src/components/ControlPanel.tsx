import React from 'react';
import { ChordSection } from './ChordSection';
import { ScaleSection } from './ScaleSection';

const ControlPanel: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChordSection />
        <ScaleSection />
      </div>
    </div>
  );
};

export default ControlPanel;