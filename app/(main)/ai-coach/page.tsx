"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: any[];
  videos?: any[];
}

const STARTER_PROMPTS = [
  "Suggest me a budget muscle gain diet",
  "Best protein powder for beginners",
  "Home workout for fat loss",
  "What should I eat after gym?",
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai-coach", {
      method: "POST",
      body: JSON.stringify({
        message: text,
        history: newMessages.slice(-5),
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply,
        products: data.products,
        videos: data.videos,
      },
    ]);

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      
      {/* Starter Prompts */}
      {messages.length === 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {STARTER_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="p-3 border rounded-lg text-sm hover:bg-muted text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i}>
            
            {/* Message */}
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "ml-auto bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {msg.content}
            </div>

            {/* Products */}
            {msg.products?.length > 0 && (
              <div className="mt-3 space-y-3">
                <p className="text-sm font-semibold">
                  💊 Recommended Supplements
                </p>

                <div className="grid gap-3">
                  {msg.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 border rounded-xl shadow-sm"
                    >
                      {/* <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-md"
                      /> */}

                      <div className="flex-1">
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.reason}
                        </p>

                        {/* <a
                          href={p.buyLink}
                          target="_blank"
                          className="text-xs text-blue-500 underline mt-1 inline-block"
                        >
                          Buy Now →
                        </a> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {msg.videos?.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold">
                  🎥 Suggested Videos
                </p>

                {msg.videos.map((v, idx) => (
                  <a
                    key={idx}
                    href={`https://www.youtube.com/results?search_query=${v.searchQuery}`}
                    target="_blank"
                    className="block text-sm text-blue-500 hover:underline"
                  >
                    ▶ {v.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <p className="text-sm">Thinking...</p>}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about fitness..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={() => sendMessage()}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}