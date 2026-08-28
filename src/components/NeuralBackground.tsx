'use client';

import React from 'react';

export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#0b0f17]">
      {/* Subtle subtle grid overlay lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
    </div>
  );
}
