'use client';

import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score?: number | null;
  size?: number;
  strokeWidth?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Normalize score to 0-100 range and handle null/undefined
  const normalizedScore = score != null ? Math.max(0, Math.min(100, score)) : 0;

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke dash offset for progress
  const offset = circumference - (animatedScore / 100) * circumference;

  // Get color based on score
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return '#10b981'; // green-500
    if (scoreValue >= 60) return '#f59e0b'; // amber-500
    if (scoreValue >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  // Animate score on mount
  useEffect(() => {
    if (score != null) {
      const timer = setTimeout(() => {
        setAnimatedScore(normalizedScore);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [normalizedScore, score]);

  const scoreColor = getScoreColor(animatedScore);

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.1))',
          }}
        />
      </svg>

      {/* Score text in center */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: size * 0.2 }}
      >
        <div className="text-center">
          {score != null ? (
            <>
              <div
                className="font-bold transition-all duration-1000 ease-out"
                style={{ color: scoreColor }}
              >
                {Math.round(animatedScore)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                /100
              </div>
            </>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              N/A
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;