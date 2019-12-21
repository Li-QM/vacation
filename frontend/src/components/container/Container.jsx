import React from 'react'

export const Container = ({ children, className = '' }) => (
  <div
    className={`${className}`}
  >
    {children}
  </div>
)
