import { getApiDocs } from '@/configs/swagger';
import { NextResponse } from 'next/server';

/**
 * Serves the Swagger API documentation as JSON
 */
export async function GET() {
  try {
    const spec = await getApiDocs();
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}