import { NextRequest, NextResponse } from 'next/server';

const POKEMON_API_BASE = process.env.POKEMON_API_BASE;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = searchParams.get('offset') || '0';
    const limit = searchParams.get('limit') || '20';

    const response = await fetch(
      `${POKEMON_API_BASE}/pokemon?offset=${offset}&limit=${limit}`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon list' },
      { status: 500 }
    );
  }
}