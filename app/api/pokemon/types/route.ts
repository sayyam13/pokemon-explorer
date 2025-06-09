import { NextRequest, NextResponse } from 'next/server';

const POKEMON_API_BASE = process.env.POKEMON_API_BASE;

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${POKEMON_API_BASE}/type`,
      {
        next: { revalidate: 86400 } // Cache for 24 hours (types rarely change)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon types');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Pokemon types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon types' },
      { status: 500 }
    );
  }
}