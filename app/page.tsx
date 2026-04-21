"use client";

import ReactMarkdown from "react-markdown";
import { useState } from "react";
import Quiz from "./components/Quiz";

type QuizData = {
  type: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type DiagramData = {
  type: string;
  title: string;
  steps: { label: string; description: string }[];
};

type Message = {
  role: "user" | "assistant";
  content: string;
  quiz?: QuizData;
  diagram?: DiagramData;
  agent?: string;
};

const TOPICS = [
  { label: "Reinforcement Learning", icon: "🎮", prompt: "Explain reinforcement learning from scratch, with a simple real-world example." },
  { label: "Neural Networks", icon: "🧠", prompt: "What are neural networks? Explain how they work step by step." },
  { label: "Reasoning Models", icon: "💡", prompt: "What are reasoning models in AI? How do they differ from regular language models?" },
  { label: "Transformers", icon: "🤖", prompt: "Explain the Transformer architecture in simple terms." },
  { label: "Computer Vision", icon: "👁️", prompt: "What is computer vision and how does it work?" },
  { label: "NLP Basics", icon: "💬", prompt: "Explain natural language processing. What are the key concepts?" },
];

function DiagramDisplay({ title, steps }: { title: string; steps: { label: string; description: string }[] }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 my-2">
      <p className="text-sm text-purple-400 font-medium mb-1">Visual Diagram</p>
      <p className="font-medium mb-4">{title}</p>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-purple-600/40" />
              )}
            </div>
            <div className="pb-6">
              <p className="font-medium">{step.label}</p>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (data.quiz && data.quiz.question && data.quiz.options) {
        setMessages([...newMessages, { role: "assistant", content: "", quiz: data.quiz, agent: data.agent }]);
      } else if (data.diagram && data.diagram.title && Array.isArray(data.diagram.steps)) {
        setMessages([...newMessages, { role: "assistant", content: "", diagram: data.diagram, agent: data.agent }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply, agent: data.agent }]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between max-w-3xl mx-auto w-full">
        <div>
          <h1 className="text-xl font-bold">AI Learning Tutor</h1>
          <p className="text-gray-400 text-sm">
            Ask me anything about AI and Machine Learning
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="px-4 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 border border-gray-700"
          >
            New Chat
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="mt-10">
            <p className="text-center text-gray-500 mb-6">
              Choose a topic to get started, or type your own question!
            </p>
            <div className="grid grid-cols-2 gap-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => sendMessage(topic.prompt)}
                  className="p-4 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <span className="text-2xl">{topic.icon}</span>
                  <p className="mt-2 font-medium">{topic.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto max-w-md"
                : "bg-gray-800 mr-auto max-w-2xl"
            }`}
          >
            {msg.role === "assistant" && msg.agent && (
              <p className="text-xs text-gray-500 mb-2">
                {msg.agent === "explainer" && "🎓 Explainer Agent"}
                {msg.agent === "coder" && "💻 Code Agent"}
                {msg.agent === "quiz" && "📝 Quiz Agent"}
                {msg.agent === "diagram" && "📊 Diagram Agent"}
              </p>
            )}
            {msg.quiz && msg.quiz.question && msg.quiz.options ? (
              <Quiz
                question={msg.quiz.question}
                options={msg.quiz.options}
                correctIndex={msg.quiz.correctIndex}
                explanation={msg.quiz.explanation}
              />
            ) : msg.diagram && msg.diagram.title && Array.isArray(msg.diagram.steps) ? (
              <DiagramDisplay
                title={msg.diagram.title}
                steps={msg.diagram.steps}
              />
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.content || "Sorry, I could not generate a response."}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-800 p-3 rounded-lg mr-auto">
            <p className="text-gray-400">Thinking...</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 max-w-3xl mx-auto w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question about AI..."
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}