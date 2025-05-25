'use client';

export default function ZoomableCanvas({ viewBox, onMouseDown, dragEnabled }) {
  const data = [200, 100, 300, 150, 250];

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className={`w-full h-full bg-white cursor-${dragEnabled ? 'grab' : 'default'}`}
        onMouseDown={onMouseDown}
      >
        {/* Axes */}
        <line x1="50" y1="550" x2="950" y2="550" stroke="black" strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2="550" stroke="black" strokeWidth="2" />

        {/* Bars */}
        {data.map((val, index) => {
          const barWidth = 80;
          const gap = 40;
          const x = 50 + gap + index * (barWidth + gap);
          const y = 550 - val;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={val}
              fill="#3b82f6"
              style={{ cursor: dragEnabled ? 'grab' : 'default' }}
            />
          );
        })}
      </svg>
    </div>
  );
}
