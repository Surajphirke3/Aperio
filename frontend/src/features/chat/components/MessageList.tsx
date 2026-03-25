import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';

interface Props {
  messages: ChatMessage[];
}

export function MessageList({ messages }: Props) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}