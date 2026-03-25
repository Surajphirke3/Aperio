import { ChatPanel } from '@/features/chat';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
      <div className="h-[calc(100%-3rem)] border rounded-xl bg-white shadow-sm overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  );
}