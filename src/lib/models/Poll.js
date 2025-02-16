import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [OptionSchema],
  totalVotes: { type: Number, default: 0 },
});

export default mongoose.models.Poll || mongoose.model("Poll", PollSchema);
