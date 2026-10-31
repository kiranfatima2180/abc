"use client";

import { useEffect, useRef, useState } from "react";

const starterMessage = {
  role: "assistant",
  content: "Hi! I’m your AI assistant. Ask me anything to get started."
};

export default function Home() {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .slice(-20)
            .map(({ role, content }) => ({ role, content }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The chatbot could not respond. Please try again.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Sorry, something went wrong: ${error.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    if (loading) return;
    setMessages([starterMessage]);
  }

  return (
    <main className="page-shell">
      <section className="chat-card" aria-label="AI chatbot">
        <header className="chat-header">
          <div className="brand-mark" aria-hidden="true">AI</div>
          <div className="heading-copy">
            <p className="eyebrow">YOUR AI ASSISTANT</p>
            <h1>LLM Chatbot</h1>
            <p className="subtitle"><span className="status-dot" /> Ready to help</p>
          </div>
          <button className="clear-button" type="button" onClick={clearChat} disabled={loading}>
            Clear chat
          </button>
        </header>

        <div className="message-list" aria-live="polite">
          {messages.map((message, index) => (
            <div className={`message-row ${message.role}`} key={`${index}-${message.role}`}>
              {message.role === "assistant" && <div className="avatar">AI</div>}
              <div className="message-bubble">
                <span className="message-label">{message.role === "user" ? "You" : "Assistant"}</span>
                <p>{message.content}</p>
              </div>
              {message.role === "user" && <div className="avatar user-avatar">You</div>}
            </div>
          ))}
          {loading && (
            <div className="message-row assistant">
              <div className="avatar">AI</div>
              <div className="message-bubble typing">
                <span className="message-label">Assistant</span>
                <p>Thinking<span className="dots">...</span></p>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="message-input">Type your message</label>
          <textarea
            id="message-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(event);
              }
            }}
            placeholder="Message your AI assistant..."
            rows={1}
            maxLength={6000}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
            {loading ? "..." : "Send"}
          </button>
          <p className="composer-hint">Enter to send · Shift + Enter for a new line</p>
        </form>
        <footer className="chat-footer">
          AI can make mistakes. Check important information.
        </footer>
      </section>
    </main>
  );
}
