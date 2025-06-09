import { NextRequest, NextResponse } from 'next/server';

const POKEMON_API_BASE = process.env.POKEMON_API_BASE;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Try to search by name first
    try {
      const response = await fetch(
        `${POKEMON_API_BASE}/pokemon/${query.toLowerCase()}`,
        {
          next: { revalidate: 3600 }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ results: [data], type: 'exact' });
      }
    } catch (error) {
      // If exact match fails, we'll return empty results
      console.log('Exact match not found, this is expected for partial searches');
    }

    // For partial matches, we'd need to implement a different strategy
    // since PokeAPI doesn't support partial search directly
    return NextResponse.json({ results: [], type: 'partial' });
    
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to search Pokemon' },
      { status: 500 }
    );
  }
}