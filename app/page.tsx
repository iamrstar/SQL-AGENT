'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-100 dark:bg-zinc-900">
      {/* Header */}
      <header className="px-4 py-3 sm:py-4 text-center border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100">
          🤖 PARI AI
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Your SQL & Analytics Assistant
        </p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`
                max-w-[92%] sm:max-w-[75%] lg:max-w-[65%]
                rounded-2xl px-3 sm:px-4 py-2 text-sm sm:text-base shadow
                break-words
                ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                }
              `}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <p
                        key={`${message.id}-${i}`}
                        className="whitespace-pre-wrap leading-relaxed"
                      >
                        {part.text}
                      </p>
                    );

                  case 'tool-db':
                  case 'tool-schema':
                    return (
                      <pre
                        key={`${message.id}-${i}`}
                        className="
                          mt-2 text-xs sm:text-sm
                          bg-zinc-900 text-green-400
                          p-3 rounded-lg
                          overflow-x-auto
                          max-w-full
                        "
                      >
                        {JSON.stringify(part, null, 2)}
                      </pre>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
        className="
          p-3 sm:p-4
          border-t border-zinc-300 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          sticky bottom-0
        "
      >
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about sales, revenue, schema..."
            className="
              flex-1 px-3 sm:px-4 py-2
              text-sm sm:text-base
              rounded-xl
              border border-zinc-300 dark:border-zinc-700
              bg-zinc-100 dark:bg-zinc-800
              text-zinc-900 dark:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
          <button
            type="submit"
            className="
              px-4 py-2
              text-sm sm:text-base
              rounded-xl
              bg-blue-600 text-white font-medium
              hover:bg-blue-700 transition
            "
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
