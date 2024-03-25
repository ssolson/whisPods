// file: /pages/api/all-episodes.ts

import { NextResponse } from 'next/server';
import { getClientAndDb } from '../mongo/db';

export const revalidate = 300;
export async function GET() {
  try {
    const { db } = await getClientAndDb();
    const collection = db.collection('thedailygweiRecap');

    // Fetch all documents from the collection sorted by episode_number
    const data = await collection
      .find()
      .sort({ episode_number: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ status: 200, message: 'Success', data: data });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
