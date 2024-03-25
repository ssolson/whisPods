import { NextRequest, NextResponse } from 'next/server';
import { getClientAndDb } from '../../mongo/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get('searchTerm') || '';
  const page = parseInt(url.searchParams.get('page') || '0', 10);
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
  const skip = page * pageSize;
  console.log(page, pageSize, searchTerm, url);

  try {
    const { db } = await getClientAndDb();
    const collection = db.collection('thedailygweiRecap');

    let pipeline = [
      {
        $search: {
          index: 'default',
          compound: {
            should: [
              {
                text: {
                  query: searchTerm,
                  path: 'episode_title',
                  fuzzy: {},
                  score: { boost: { value: 3 } },
                },
              },
              {
                text: {
                  query: searchTerm,
                  path: 'episode_data.headline',
                  fuzzy: {},
                  score: { boost: { value: 2 } },
                },
              },
              {
                text: {
                  query: searchTerm,
                  path: 'episode_data.summary',
                  fuzzy: {},
                  score: { boost: { value: 1 } },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ];

    if (!searchTerm) {
      pipeline.shift();
    }

    const searchResults = await collection.aggregate(pipeline).toArray();
    return new NextResponse(
      JSON.stringify({
        status: 200,
        message: 'Success',
        data: searchResults,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
