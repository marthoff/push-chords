import type { GridCell } from '../types';
import { memo } from 'react';

interface GridProps {
  cells: GridCell[][];
}

const Grid = memo(({ cells }: GridProps) => {
  return (
    <div className="grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '4px',
      width: '100%',
      maxWidth: '600px',
      aspectRatio: '1',
      padding: '8px',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px'
    }}>
      {cells.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              backgroundColor: cell.isActive ? '#00a8ff' : '#404040',
              aspectRatio: '1',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {cell.interval}
          </div>
        ))
      ))}
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid; 