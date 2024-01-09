import { NextResponse, NextRequest } from "next/server";
import { getClientAndDb } from "@/app/api/mongo/db";
import { ObjectId } from "mongodb"; // Import ObjectId

export const dynamic = "force-dynamic";

function isValidObjectId(str: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(str);
}

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ status: 405, message: "Method Not Allowed" });
  }

  try {
    const { db } = await getClientAndDb();

    // Extract search term from the request URL
    const pathParts = req.nextUrl.pathname.split("/");
    const searchTerm = pathParts[pathParts.length - 1].toLowerCase();

    if (!searchTerm) {
      return NextResponse.json({
        status: 400,
        message: "Search term is required",
      });
    }

    const transcriptCollection = db.collection("theDailyGweiTranscript");
    // const transcripts = await transcriptCollection.find({}).toArray();
    const transcripts = await transcriptCollection.find({
      complete_transcript: { $regex: searchTerm, $options: 'i' }
    }).toArray();

    const matchedEpisodes: {
      episodeId: string;
      matchedSegmentNumbers: number[];
    }[] = [];

    transcripts.forEach((transcript) => {
      const matchedSegmentNumbers = transcript.complete_transcript
        .map(
          (
            segmentText: string,
            index: number // Explicitly annotate index as number
          ) => (segmentText.toLowerCase().includes(searchTerm) ? index : -1)
        )
        .filter((index: number) => index !== -1); // You can also annotate here for clarity, though it's not strictly necessary

      if (matchedSegmentNumbers.length > 0) {
        matchedEpisodes.push({
          episodeId: transcript._id.toString(), // Convert ObjectId to string
          matchedSegmentNumbers,
        });
      }
    });

    const recapCollection = db.collection("thedailygweiRecap");
    const episodeNumbers = matchedEpisodes.map((episode) =>
      parseInt(episode.episodeId)
    );

    const episodes = await recapCollection
      .find({ episode_number: { $in: episodeNumbers } })
      .toArray();

    const result = episodes.map((episode) => ({
      ...episode,
      matchedSegmentNumbers: matchedEpisodes.find(
        (match) => match.episodeId === episode._id.toString()
      )?.matchedSegmentNumbers,
    }));

    const response = NextResponse.json({
      status: 200,
      message: "Success",
      data: result,
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
