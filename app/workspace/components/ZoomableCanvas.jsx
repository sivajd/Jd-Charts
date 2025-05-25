'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function ZoomableCanvas({ viewBox, onMouseDown, dragEnabled, chartType, isPlaying }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const containerRef = useRef(null);
  const data = useRef([200, 100, 300, 150, 250]); // Use ref to persist data
  const animationInterval = useRef(null);

  // Initialize ECharts and update chart
  useEffect(() => {
    if (chartRef.current) {
      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
      }

      const options = {
        ...(chartType === 'pie'
          ? {
              series: [
                {
                  type: 'pie',
                  data: data.current.map((val, index) => ({
                    value: val,
                    name: ['A', 'B', 'C', 'D', 'E'][index],
                  })),
                  radius: '50%',
                  itemStyle: { color: '#3b82f6' },
                },
              ],
            }
          : {
              xAxis: {
                type: 'category',
                data: ['A', 'B', 'C', 'D', 'E'],
                axisLine: { lineStyle: { color: '#000', width: 2 } },
                boundaryGap: true,
              },
              yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#000', width: 2 } },
                min: 0,
                max: 600,
              },
              series: [
                {
                  type: chartType,
                  data: data.current,
                  itemStyle: { color: '#3b82f6' },
                  barWidth: chartType === 'bar' ? 80 : undefined,
                  animation: true, // Enable ECharts animation
                  animationDuration: 500, // Smooth transition for bar updates
                },
              ],
            }),
        grid: chartType === 'pie' ? {} : { left: 50, right: 50, bottom: 50, top: 50 },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: chartType === 'pie' ? undefined : 0,
            yAxisIndex: chartType === 'pie' ? undefined : 0,
            zoomLock: false,
          },
        ],
      };

      chartInstanceRef.current.setOption(options, true);

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
      };
    }
  }, [chartType]);

  // Animation for bar chart
  useEffect(() => {
    if (chartType !== 'bar' || !chartInstanceRef.current) return;

    if (isPlaying) {
      animationInterval.current = setInterval(() => {
        data.current = data.current.map(() => Math.floor(Math.random() * 400) + 100); // Random values 100-500
        chartInstanceRef.current.setOption({
          series: [
            {
              type: 'bar',
              data: data.current,
            },
          ],
        });
      }, 1000); // Update every 1 second
    } else {
      clearInterval(animationInterval.current);
    }

    return () => clearInterval(animationInterval.current);
  }, [isPlaying, chartType]);

  // Apply CSS transform for zoom and drag
  useEffect(() => {
    if (containerRef.current) {
      const scaleX = 1000 / viewBox.width;
      const scaleY = 600 / viewBox.height;
      const translateX = viewBox.x;
      const translateY = viewBox.y;
      containerRef.current.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      containerRef.current.style.transformOrigin = 'center center';
    }
  }, [viewBox]);

  // Expose chart instance for export
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartRef.current.chartInstance = chartInstanceRef.current;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white"
      style={{ cursor: dragEnabled ? 'grab' : 'default' }}
      onMouseDown={onMouseDown}
    >
      <div
        ref={chartRef}
        className="bg-white"
        style={{ width: '1200px', height: '700px' }}
      />
    </div>
  );
}