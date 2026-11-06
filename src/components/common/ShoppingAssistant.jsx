import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../../api";
import "./ShoppingAssistant.css";

const welcomeMessage = {
  role: "assistant",
  text: "Hi! I'm your AI Shopping Assistant. Tell me what you're looking for, and I'll help you find it.",
};

export default function ShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const requestInProgress = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  async function handleSend() {
    const message = draft.trim();
    if (!message || requestInProgress.current) return;

    requestInProgress.current = true;
    setIsLoading(true);
    setDraft("");
    setMessages((current) => [...current, { role: "user", text: message }]);

    try {
      const response = await sendChatMessage(message, history);
      const reply = response?.data?.reply ?? response?.data?.data?.reply;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error("The assistant returned an empty reply.");
      }

      setMessages((current) => [...current, { role: "assistant", text: reply }]);
      setHistory((current) => [
        ...current,
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "error",
          text: "Sorry, I couldn't get a response right now. Please try again.",
        },
      ]);
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="shopping-assistant">
      {isOpen && (
        <section className="shopping-assistant__panel" aria-label="AI Shopping Assistant">
          <header className="shopping-assistant__header">
            <div className="shopping-assistant__avatar" aria-hidden="true">AI</div>
            <div className="shopping-assistant__heading">
              <h2>AI Shopping Assistant</h2>
              <span>Here to help you shop</span>
            </div>
            <button
              className="shopping-assistant__close"
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className="shopping-assistant__messages" role="log" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`shopping-assistant__message shopping-assistant__message--${message.role}`}
                key={`${message.role}-${index}`}
              >
                <p>{message.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="shopping-assistant__message shopping-assistant__message--assistant shopping-assistant__typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="shopping-assistant__composer"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <label className="visually-hidden" htmlFor="shopping-assistant-message">
              Your message
            </label>
            <textarea
              id="shopping-assistant-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about products..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="shopping-assistant__send"
              type="submit"
              aria-label="Send message"
              disabled={isLoading || !draft.trim()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </form>
          <p className="shopping-assistant__hint">Enter to send · Shift+Enter for a new line</p>
        </section>
      )}

      <button
        className="shopping-assistant__toggle"
        type="button"
        aria-label={isOpen ? "Close shopping assistant" : "Open shopping assistant"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
