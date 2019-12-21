import React from 'react'

const Container = ({ children, className = '' }) => (
  <div
    className={`${className}`}
  >
    {children}
  </div>
)

export default Container;
