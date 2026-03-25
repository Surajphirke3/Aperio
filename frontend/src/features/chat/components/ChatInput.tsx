'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { SendHorizonal, Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { cn } from '@/shared/utils/cn';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, startListening, stopListening, transcript } = useVoiceInput();

  if (transcript && transcript !== value) setValue(transcript);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="flex items-end gap-2 bg-[var(--chat-input-bg)] border border-[var(--border)] rounded-xl p-2 focus-within:border-[var(--accent-primary)] transition-colors">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Purchased 300kg of PET from Vendor A..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent resize-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none font-mono py-2 px-2 max-h-40 leading-relaxed"
      />

      <div className="flex gap-1 pb-1">
        <button
          onClick={isListening ? stopListening : startListening}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isListening
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : 'text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
          )}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="p-2 rounded-lg bg-[var(--accent-primary)] text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--accent-secondary)] transition-colors"
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  );
}