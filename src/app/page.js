"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get("/api/polls");
      setPolls(response.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPoll = async () => {
    try {
      const filteredOptions = options.filter((opt) => opt.trim() !== "");
      if (filteredOptions.length < 2) {
        alert("Please add at least 2 options.");
        return;
      }
      await axios.post("/api/polls", { question, options: filteredOptions });
      setQuestion("");
      setOptions(["", ""]);
      fetchPolls();
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const vote = async (pollId, optionIndex) => {
    try {
      await axios.post(`/api/polls/${pollId}/vote`, { optionIndex });
      fetchPolls();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const calculateTotalVotes = (poll) => {
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(2);
  };

  const filteredPolls = polls.filter((poll) => 
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Create a Poll</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-white"
        />
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-white"
          />
        ))}
        <div className="flex space-x-2">
          <button
            onClick={() => setOptions([...options, ""])}
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Add Option
          </button>
          <button
            onClick={createPoll}
            className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Create Poll
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-8 mb-6 text-center text-black">Active Polls</h2>
      <input
        type="text"
        placeholder="Search polls..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black bg-white"
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => {
            const totalVotes = calculateTotalVotes(poll);
            return (
              <div key={poll._id} className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-xl font-semibold mb-4 text-black">{poll.question}</h3>
                {poll.options.map((option, index) => {
                  const percentage = calculatePercentage(option.votes, totalVotes);
                  return (
                    <div key={index} className="my-2">
                      <button
                        onClick={() => vote(poll._id, index)}
                        className="w-full bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition duration-200 relative overflow-hidden border border-gray-300"
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-gray-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <span className="relative">{option.text}</span>
                      </button>
                      <div className="flex justify-between mt-1 text-sm text-gray-700">
                        <span>{option.votes} votes</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
