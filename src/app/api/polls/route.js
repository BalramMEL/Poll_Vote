import { connectToDatabase } from "@/lib/db";
import Poll from "@/lib/models/Poll";

export async function GET() {
  await connectToDatabase();
  const polls = await Poll.find({});
  return Response.json(polls);
}

export async function POST(req) {
  await connectToDatabase();
  const { question, options } = await req.json();
  const poll = new Poll({
    question,
    options: options.map((opt) => ({ text: opt, votes: 0 })),
  });
  await poll.save();
  return Response.json(poll, { status: 201 });
}
