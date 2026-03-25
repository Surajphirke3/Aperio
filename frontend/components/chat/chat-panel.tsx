"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Bot, Leaf, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "./message-bubble"
import { NLPPipelinePanel } from "./nlp-pipeline-panel"
import { AIModelInfo } from "./ai-model-info"
import { fetchFromAPI } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  pipelineData?: NLPPipelineData
}

interface NLPPipelineData {
  intent: string
  confidence: number
  rejectedIntents: { name: string; confidence: number }[]
  entities: { text: string; label: string; value: string }[]
  originalMessage: string
  jsonOutput: Record<string, unknown>
  savedRecords: { icon: string; text: string }[]
  batchId?: string
}

// All 6 suggested prompts from the PS
const suggestedPrompts = [
  "Received 500 kg PET from GreenCycle this morning",
  "Dispatched 180 kg HDPE granules to Buyer Corp today",
  "Processed 320 kg PP through shredder, got 280 kg out",
  "How much material was dispatched last week?",
  "Show losses during processing this month",
  "What's the status of batch B-2024-089?",
]

const chatHistory = [
  { id: "1", preview: "Logged 500 kg PET...", time: "2 hours ago", entries: 2, queries: 1 },
  { id: "2", preview: "Query: Weekly losses...", time: "Yesterday", entries: 0, queries: 3 },
  { id: "3", preview: "Batch status check...", time: "2 days ago", entries: 1, queries: 2 },
  { id: "4", preview: "Dispatch report...", time: "3 days ago", entries: 0, queries: 1 },
  { id: "5", preview: "Vendor delivery log...", time: "4 days ago", entries: 3, queries: 0 },
]

// Generate batch ID
function generateBatchId() {
  const year = new Date().getFullYear()
  const num = Math.floor(Math.random() * 100) + 90
  return `B-${year}-0${num}`
}

// Get current date formatted
function getCurrentDate() {
  return new Date().toISOString().split('T')[0]
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): { content: string; pipelineData?: NLPPipelineData } => {
    const lowerMessage = userMessage.toLowerCase()

    // PURCHASE intent
    if (lowerMessage.includes("purchased") || lowerMessage.includes("received") || lowerMessage.includes("bought") || lowerMessage.match(/received.*kg/i)) {
      const quantityMatch = userMessage.match(/(\d+)\s*kg/i)
      const materialMatch = userMessage.match(/(PET|HDPE|PP|PVC|plastic|bottles|containers|film|packaging|granules)/i)
      const vendorMatch = userMessage.match(/from\s+([A-Za-z\s]+?)(?:\s+(?:today|yesterday|this|on|$))/i)
      const dateText = lowerMessage.includes("yesterday") ? "Yesterday" : lowerMessage.includes("this morning") ? "This morning" : "Today"
      
      const batchId = generateBatchId()
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 500
      const material = materialMatch ? materialMatch[1] : "PET"
      const vendor = vendorMatch ? vendorMatch[1].trim() : "GreenCycle Industries"

      return {
        content: "I've processed your entry and extracted the following data:",
        pipelineData: {
          intent: "PURCHASE",
          confidence: 87,
          rejectedIntents: [
            { name: "DISPATCH", confidence: 23 },
            { name: "QUERY", confidence: 12 },
          ],
          entities: [
            { text: `${quantity} kg`, label: "QUANTITY", value: `${quantity}` },
            { text: material, label: "MATERIAL", value: material },
            { text: vendor, label: "VENDOR", value: vendor },
            { text: dateText.toLowerCase(), label: "DATE", value: getCurrentDate() },
          ],
          originalMessage: userMessage,
          jsonOutput: {
            intent: "PURCHASE",
            confidence: 0.87,
            entities: {
              material: material,
              quantity_kg: quantity,
              vendor: vendor,
              date: getCurrentDate(),
              stage: "COLLECTION"
            },
            batch_id_generated: batchId,
            flags: []
          },
          savedRecords: [
            { icon: "check", text: `Batch record created: ${batchId}` },
            { icon: "check", text: "Collection stage logged" },
            { icon: "check", text: "Vendor record updated" },
            { icon: "check", text: `Carbon tracker updated (+${(quantity * 0.00042).toFixed(2)} kg)` },
          ],
          batchId: batchId,
        },
      }
    }

    // DISPATCH intent
    if (lowerMessage.includes("dispatched") || lowerMessage.includes("sent") || lowerMessage.includes("shipped")) {
      const quantityMatch = userMessage.match(/(\d+)\s*kg/i)
      const materialMatch = userMessage.match(/(PET|HDPE|PP|PVC|plastic|bottles|containers|film|packaging|granules)/i)
      const buyerMatch = userMessage.match(/to\s+([A-Za-z\s]+?)(?:\s+(?:today|yesterday|this|on|$))/i)
      
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 180
      const material = materialMatch ? materialMatch[1] : "HDPE granules"
      const buyer = buyerMatch ? buyerMatch[1].trim() : "Buyer Corp"

      return {
        content: "Dispatch entry recorded successfully:",
        pipelineData: {
          intent: "DISPATCH",
          confidence: 91,
          rejectedIntents: [
            { name: "PURCHASE", confidence: 18 },
            { name: "PROCESSING", confidence: 8 },
          ],
          entities: [
            { text: `${quantity} kg`, label: "QUANTITY", value: `${quantity}` },
            { text: material, label: "MATERIAL", value: material },
            { text: buyer, label: "BUYER", value: buyer },
            { text: "today", label: "DATE", value: getCurrentDate() },
          ],
          originalMessage: userMessage,
          jsonOutput: {
            intent: "DISPATCH",
            confidence: 0.91,
            entities: {
              material: material,
              quantity_kg: quantity,
              buyer: buyer,
              date: getCurrentDate(),
              stage: "DISPATCH"
            },
            batch_id_updated: "B-2024-088",
            flags: []
          },
          savedRecords: [
            { icon: "check", text: "Dispatch stage logged to B-2024-088" },
            { icon: "check", text: `${quantity} kg marked as dispatched` },
            { icon: "check", text: "Buyer record created" },
            { icon: "check", text: "Batch status updated to COMPLETE" },
          ],
          batchId: "B-2024-088",
        },
      }
    }

    // PROCESSING intent
    if (lowerMessage.includes("processed") || lowerMessage.includes("shredded") || lowerMessage.includes("sorted")) {
      const inputMatch = userMessage.match(/(\d+)\s*kg/i)
      const outputMatch = userMessage.match(/got\s+(\d+)|output\s+(\d+)|out\s+(\d+)/i)
      const stageMatch = userMessage.match(/(shredder|sorting|granulation|washing)/i)
      
      const inputKg = inputMatch ? parseInt(inputMatch[1]) : 320
      const outputKg = outputMatch ? parseInt(outputMatch[1] || outputMatch[2] || outputMatch[3]) : 280
      const lossKg = inputKg - outputKg
      const stage = stageMatch ? stageMatch[1] : "shredder"

      return {
        content: "Processing stage recorded:",
        pipelineData: {
          intent: "PROCESSING",
          confidence: 89,
          rejectedIntents: [
            { name: "PURCHASE", confidence: 15 },
            { name: "DISPATCH", confidence: 11 },
          ],
          entities: [
            { text: `${inputKg} kg`, label: "QUANTITY", value: `${inputKg}` },
            { text: stage, label: "STAGE", value: stage },
            { text: `${outputKg} kg out`, label: "QUANTITY", value: `${outputKg}` },
          ],
          originalMessage: userMessage,
          jsonOutput: {
            intent: "PROCESSING",
            confidence: 0.89,
            entities: {
              stage: stage.toUpperCase(),
              input_kg: inputKg,
              output_kg: outputKg,
              loss_kg: lossKg,
              loss_percent: ((lossKg / inputKg) * 100).toFixed(1),
              date: getCurrentDate()
            },
            batch_id_updated: "B-2024-090",
            flags: lossKg / inputKg > 0.2 ? ["HIGH_LOSS_WARNING"] : []
          },
          savedRecords: [
            { icon: "check", text: "Processing stage logged to B-2024-090" },
            { icon: "check", text: `Input: ${inputKg} kg, Output: ${outputKg} kg` },
            { icon: "check", text: `Loss recorded: ${lossKg} kg (${((lossKg / inputKg) * 100).toFixed(1)}%)` },
            { icon: "check", text: "Batch completeness updated" },
          ],
          batchId: "B-2024-090",
        },
      }
    }

    // QUERY_REPORT intent
    if (lowerMessage.includes("how much") || lowerMessage.includes("show me") || lowerMessage.includes("total") || (lowerMessage.includes("dispatch") && lowerMessage.includes("week"))) {
      return {
        content: "Here's the report you requested:",
        pipelineData: {
          intent: "QUERY_REPORT",
          confidence: 93,
          rejectedIntents: [
            { name: "QUERY_LOSSES", confidence: 32 },
            { name: "QUERY_STATUS", confidence: 14 },
          ],
          entities: [
            { text: "dispatched", label: "METRIC", value: "dispatch_volume" },
            { text: "last week", label: "DATE", value: "last_7_days" },
          ],
          originalMessage: userMessage,
          jsonOutput: {
            intent: "QUERY_REPORT",
            filters: {
              metric: "dispatch_volume",
              date_range: { from: "2026-03-18", to: "2026-03-25" },
              process_type: null
            },
            result_preview: {
              total_kg: 2847,
              batch_count: 4,
              top_material: "PET Bottles"
            }
          },
          savedRecords: [
            { icon: "check", text: "Query executed successfully" },
            { icon: "check", text: "Found 4 matching batches" },
            { icon: "check", text: "Total: 2,847 kg dispatched" },
          ],
        },
      }
    }

    // QUERY_LOSSES intent
    if (lowerMessage.includes("loss") || lowerMessage.includes("losses") || lowerMessage.includes("wasted")) {
      return {
        content: "Here's the loss analysis:",
        pipelineData: {
          intent: "QUERY_LOSSES",
          confidence: 95,
          rejectedIntents: [
            { name: "QUERY_REPORT", confidence: 28 },
            { name: "PROCESSING", confidence: 9 },
          ],
          entities: [
            { text: "processing", label: "STAGE", value: "processing" },
            { text: "this month", label: "DATE", value: "march_2026" },
          ],
          originalMessage: userMessage,
          jsonOutput: {
            intent: "QUERY_LOSSES",
            filters: {
              stage: "processing",
              date_range: { from: "2026-03-01", to: "2026-03-25" },
              threshold: 0.2
            },
            result_preview: {
              total_loss_kg: 2847,
              avg_loss_percent: 18.3,
              batches_above_threshold: 2,
              worst_batch: "B-2024-089"
            }
          },
          savedRecords: [
            { icon: "check", text: "Loss query executed" },
            { icon: "check", text: "Analyzed 12 batches" },
            { icon: "check", text: "2 batches flagged above 20% threshold" },
          ],
        },
      }
    }

    // QUERY_STATUS intent
    if (lowerMessage.includes("status") || lowerMessage.includes("where is") || lowerMessage.includes("check batch")) {
      const batchMatch = userMessage.match(/B-\d{4}-\d{3}/i)
      const batchId = batchMatch ? batchMatch[0] : "B-2024-089"

      return {
        content: `Here's the status for batch ${batchId}:`,
        pipelineData: {
          intent: "QUERY_STATUS",
          confidence: 96,
          rejectedIntents: [
            { name: "QUERY_REPORT", confidence: 18 },
            { name: "QUERY_LOSSES", confidence: 12 },
          ],
          entities: [
            { text: batchId, label: "BATCH_ID", value: batchId },
          ],
          originalMessage: userMessage,
          jsonOutput: {
            intent: "QUERY_STATUS",
            filters: {
              batch_id: batchId
            },
            result_preview: {
              status: "ANOMALY",
              current_stage: "PROCESSING",
              completeness: 72,
              last_update: "2 hours ago",
              flags: ["HIGH_PROCESSING_LOSS"]
            }
          },
          savedRecords: [
            { icon: "check", text: `Status retrieved for ${batchId}` },
            { icon: "check", text: "Current stage: PROCESSING" },
            { icon: "check", text: "Alert: High processing loss detected" },
          ],
          batchId: batchId,
        },
      }
    }

    // Generic response
    return {
      content: "I'm here to help you manage your traceability data. You can ask me to:\n\n- **Log entries**: 'Received 500 kg PET from GreenCycle today'\n- **Track dispatches**: 'Dispatched 180 kg HDPE to Buyer Corp'\n- **Log processing**: 'Processed 320 kg PP through shredder, got 280 kg out'\n- **Query data**: 'How much was dispatched last week?'\n- **Check losses**: 'Show losses during processing this month'\n- **Check status**: 'What's the status of batch B-2024-089?'\n\nTry one of the suggested prompts below!",
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessageContent = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetchFromAPI("/chat/", {
        method: "POST",
        body: JSON.stringify({ message: userMessageContent, session_id: "demo_session" })
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply || "I encountered an issue processing that request.",
        timestamp: new Date(),
        pipelineData: response.structured_data ? {
          intent: response.intent,
          confidence: 95,
          rejectedIntents: [],
          entities: [],
          originalMessage: userMessageContent,
          jsonOutput: response.structured_data,
          savedRecords: [{ icon: "check", text: "Action processed via backend" }]
        } : undefined,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error: any) {
      console.error("Chat API error:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, there was an error communicating with the AI backend: ${error.message} (Try checking if your backend env variables are valid)`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      
      // Fallback response for demonstration if backend fails
      setTimeout(() => {
        const fbMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "As a fallback, I recommend making sure your python backend terminal is running without errors and your FEATHERLESS_API_KEY/GROQ_API_KEY is valid in the .env.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, fbMessage])
      }, 1000)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Chat History Sidebar */}
      <div className="w-[280px] border-r border-tf-border bg-tf-bg-primary p-4 flex flex-col">
        <h3 className="text-tf-text-primary font-semibold mb-4">Chat History</h3>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left p-3 rounded-lg bg-tf-bg-secondary hover:bg-tf-bg-tertiary transition-colors"
            >
              <p className="text-tf-text-primary text-sm truncate">
                {chat.preview}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-tf-text-muted text-xs">{chat.time}</p>
                {chat.entries > 0 && (
                  <span className="text-tf-accent-green text-xs flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {chat.entries} entries
                  </span>
                )}
                {chat.queries > 0 && (
                  <span className="text-tf-accent-blue text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {chat.queries} queries
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-tf-border bg-tf-bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tf-accent-green/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-tf-accent-green" />
            </div>
            <div>
              <h2 className="text-tf-text-primary font-semibold">
                Aperio AI Assistant
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-pulse" />
                <span className="text-tf-text-muted text-xs">
                  Llama 3.2-3B via Featherless AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI Model Info Panel */}
          <AIModelInfo autoCollapse={true} collapseDelay={5000} />

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-tf-accent-green/20 flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-tf-accent-green" />
              </div>
              <h3 className="text-tf-text-primary text-xl font-semibold mb-2">
                What would you like to do today?
              </h3>
              <p className="text-tf-text-secondary text-center max-w-md mb-8">
                Log materials in plain English. I'll extract intent, entities, and save structured data automatically.
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl overflow-x-auto pb-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-4 py-2 rounded-full bg-tf-bg-secondary border border-tf-border text-tf-text-secondary text-sm hover:bg-tf-bg-tertiary hover:text-tf-text-primary transition-colors whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <div key={message.id}>
                    <MessageBubble message={message} />
                    {message.pipelineData && (
                      <NLPPipelinePanel data={message.pipelineData} />
                    )}
                  </div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-tf-bg-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-tf-accent-green" />
                  </div>
                  <div className="bg-tf-bg-secondary border-l-2 border-tf-accent-green/50 rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="typing-dot w-2 h-2 rounded-full bg-tf-accent-green" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-tf-accent-green" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-tf-accent-green" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-tf-border bg-tf-bg-secondary/50">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in plain English... e.g. 'Received 450 kg PP from CircularMat today'"
                className="w-full bg-tf-bg-tertiary border border-tf-border rounded-lg px-4 py-3 text-tf-text-primary placeholder:text-tf-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-tf-accent-green/50"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
              {input.length > 100 && (
                <span className="absolute right-3 bottom-3 text-tf-text-muted text-xs font-mono">
                  {input.length}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-tf-text-muted hover:text-tf-text-primary"
              title="Voice input coming soon"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-tf-accent-green hover:bg-tf-accent-green-dim text-tf-bg-primary"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
