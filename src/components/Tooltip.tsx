'use client';

import { useState } from 'react';

interface Props {
  text: string;
}

export default function InfoTooltip({ text }: Props) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
        aria-label="Info"
        type="button"
      >
        i
      </button>
      {show && (
        <div className="absolute z-50 left-6 top-0 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-xl">
          {text}
        </div>
      )}
    </span>
  );
}
