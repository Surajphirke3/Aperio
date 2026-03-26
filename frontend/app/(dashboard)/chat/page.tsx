import { TopBar } from "@/components/layout/topbar"
import { ChatPanel } from "@/components/chat/chat-panel"

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title="AI Chat"
        subtitle="Log entries and query data using natural language"
      />
      <ChatPanel />
    </div>
  )
}
