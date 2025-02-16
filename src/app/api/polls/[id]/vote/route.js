import { connectToDatabase } from "@/lib/db";
import Poll from "@/lib/models/Poll";

export async function POST(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const { optionIndex } = await req.json();

  const poll = await Poll.findById(id);
  if (!poll) return Response.json({ error: "Poll not found" }, { status: 404 });

  poll.options[optionIndex].votes += 1;
  poll.totalVotes += 1;
  await poll.save();

  return Response.json(poll);
}
