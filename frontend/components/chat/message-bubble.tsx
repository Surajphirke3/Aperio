"use client"

import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-tf-accent-green" : "bg-tf-bg-secondary"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-tf-bg-primary" />
        ) : (
          <Bot className="w-4 h-4 text-tf-accent-green" />
        )}
      </div>

      <div className={cn("max-w-[70%]", isUser && "text-right")}>
        <div
          className={cn(
            "px-4 py-3 rounded-lg",
            isUser
              ? "bg-tf-accent-green text-tf-bg-primary rounded-br-none"
              : "bg-tf-bg-secondary border-l-2 border-tf-accent-green/50 text-tf-text-primary rounded-bl-none"
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <p
          className={cn(
            "text-xs text-tf-text-muted mt-1 font-mono",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  )
}
