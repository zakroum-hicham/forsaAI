"use client";

import { useState } from 'react';

export const TextExpander = ({ text, maxLength = 400 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className="text-slate-600 text-sm mb-4">{text}</p>;
  }

  const truncatedText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

  return (
    <p className="text-slate-600 text-sm mb-4">
      {truncatedText}
      <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500 hover:underline ml-1 cursor-pointer">
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </p>
  );
};
