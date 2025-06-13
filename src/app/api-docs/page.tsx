'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SwaggerUIWrapper from '@/components/SwaggerUIWrapper';

export default function ApiDoc() {
  const [spec, setSpec] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSpec() {
      try {
        setLoading(true);
        const response = await axios.get('/api/swagger');
        setSpec(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch API spec:', err);
        setError('Failed to load API documentation. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSpec();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      
      {loading && <p>Loading API documentation...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && <SwaggerUIWrapper spec={spec} />}
    </div>
  );
}
