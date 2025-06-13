'use client';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIWrapperProps {
  spec: Record<string, unknown>;
}

// This wrapper component disables React Strict Mode warnings for Swagger UI
export default function SwaggerUIWrapper({ spec }: SwaggerUIWrapperProps) {
  return (
    // Remove StrictMode for the Swagger UI component
    <div className="swagger-ui-wrapper">
      <SwaggerUI spec={spec} />
    </div>
  );
}