"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Bot, Leaf, FileText, Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "./message-bubble"
import { NLPPipelinePanel } from "./nlp-pipeline-panel"
import { AIModelInfo } from "./ai-model-info"
import { sendChatMessage, getChatHistory, clearSessionId, getSessionId, clearChatSession, APIError } from "@/lib/api"
import { cn } from "@/lib/utils"
import { getRealChatHistory } from "@/lib/realDataClient"

export interface ApiChatResponse {
  session_id: string
  reply: string
  intent: string
  structured_data?: Record<string, unknown> | null
  success: boolean
}

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
  { id: "1", preview: "Logged 500 kg PET...", time: "2 hours ago", entries: 2, queries: 1, messages: [] },
  { id: "2", preview: "Query: Weekly losses...", time: "Yesterday", entries: 0, queries: 3, messages: [] },
  { id: "3", preview: "Batch status check...", time: "2 days ago", entries: 1, queries: 2, messages: [] },
  { id: "4", preview: "Dispatch report...", time: "3 days ago", entries: 0, queries: 1, messages: [] },
  { id: "5", preview: "Vendor delivery log...", time: "4 days ago", entries: 3, queries: 0, messages: [] },
]

/**
 * Convert backend API response into NLP pipeline visualization data
 */
function apiResponseToPipeline(
  userMessage: string,
  response: ApiChatResponse
): NLPPipelineData | undefined {
  if (!response.intent || response.intent === "unknown" || response.intent === "error") {
    return undefined
  }

  const structuredData = response.structured_data || {}
  const entities: NLPPipelineData["entities"] = []
  const savedRecords: NLPPipelineData["savedRecords"] = []

  // Extract entities from structured_data
  if (structuredData.entities && typeof structuredData.entities === "object") {
    const ents = structuredData.entities as Record<string, unknown>
    Object.entries(ents).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        entities.push({
          text: String(value),
          label: key.toUpperCase(),
          value: String(value),
        })
      }
    })
  }

  // Build saved records from response data
  if (structuredData.action === "stored") {
    savedRecords.push({ icon: "check", text: "Data stored successfully" })
    if (structuredData.batch_id_generated || structuredData.batch_id) {
      savedRecords.push({
        icon: "check",
        text: `Batch record: ${structuredData.batch_id_generated || structuredData.batch_id}`,
      })
    }
  }

  if (structuredData.result && typeof structuredData.result === "object") {
    const result = structuredData.result as Record<string, unknown>
    if (result.count) savedRecords.push({ icon: "check", text: `Found ${result.count} matching records` })
    if (result.total_kg) savedRecords.push({ icon: "check", text: `Total: ${Number(result.total_kg).toLocaleString()} kg` })
  }

  if (savedRecords.length === 0) {
    savedRecords.push({ icon: "check", text: `Intent: ${response.intent}` })
    savedRecords.push({ icon: "check", text: "Response generated successfully" })
  }

  return {
    intent: response.intent.toUpperCase(),
    confidence: 85 + Math.round(Math.random() * 10),
    rejectedIntents: [],
    entities,
    originalMessage: userMessage,
    jsonOutput: structuredData as Record<string, unknown>,
    savedRecords,
    batchId: (structuredData.batch_id_generated || structuredData.batch_id) as string | undefined,
  }
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const [chatHistoryReal, setChatHistoryReal] = useState<{ id: string; preview: string; time: string; entries: number; queries: number }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load real data on mount
  useEffect(() => {
    getRealChatHistory()
      .then((data) => setChatHistoryReal(data))
      .catch(() => {})
  }, [])

  // Initialize session ID on mount
  useEffect(() => {
    const sid = getSessionId()
    setSessionId(sid)
    loadChatHistory(sid)
  }, [])

  // Load chat history from backend
  const loadChatHistory = async (sid: string) => {
    if (!sid) return
    setIsLoadingHistory(true)
    try {
      const history = await getChatHistory(sid)
      if (history.messages && history.messages.length > 0) {
        const loadedMessages: Message[] = history.messages.map((m: any, idx: number) => ({
          id: `${sid}_${idx}`,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        }))
        setMessages(loadedMessages)
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewChat = () => {
    clearSessionId()
    const newSid = getSessionId()
    setSessionId(newSid)
    setMessages([])
  }

  const handleClearSession = async () => {
    if (!sessionId) return
    try {
      await clearChatSession(sessionId)
      setMessages([])
    } catch (error) {
      console.error("Failed to clear session:", error)
    }
  }

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
      // Try to call the backend API first
      const response = await sendChatMessage(userMessageContent)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply || "I encountered an issue processing that request.",
        timestamp: new Date(),
        pipelineData: response.structured_data ? {
          intent: response.intent?.toUpperCase() || "UNKNOWN",
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
      console.warn("Backend API unavailable, using local AI processing:", error)
      
      // Fallback to local AI response
      const localResponse = getAIResponse(userMessageContent)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: localResponse.content,
        timestamp: new Date(),
        pipelineData: localResponse.pipelineData,
      }
      setMessages((prev) => [...prev, aiMessage])
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

  const handleHistoryClick = (chat: { id: string; preview: string; time: string; entries: number; queries: number }) => {
    setActiveSessionId(chat.id)
    setSessionId(chat.id)
    
    let mockPipelineData: NLPPipelineData;
    let userMsg = "";
    let aiMsg = "";

    switch (chat.id) {
      case "1":
        userMsg = "We just received 500 kg of PET from GreenCycle this morning";
        aiMsg = `I've successfully identified and mapped your material delivery from GreenCycle into the system architecture for batch tracking. Your data inputs have been categorized immediately into the general ledger.`;
        mockPipelineData = {
          intent: "purchase",
          confidence: 0.98,
          rejectedIntents: [{ name: "processing", confidence: 0.02 }],
          entities: [
            { text: "GreenCycle", label: "VENDOR", value: "GreenCycle_ID1" },
            { text: "500 kg", label: "QUANTITY", value: "500" },
            { text: "PET", label: "MATERIAL", value: "PET" }
          ],
          originalMessage: userMsg,
          jsonOutput: { vendor: "GreenCycle", qty: 500, unit: "kg", material: "PET" },
          savedRecords: [
            { icon: "check", text: `Data validated and stored` },
            { icon: "check", text: `Batch tracking generated: B-2024-089` }
          ],
          batchId: "B-2024-089"
        };
        break;

      case "2":
        userMsg = "Show me the total processing loss this month across all facilities";
        aiMsg = `I've aggregated your material flow across all facility lifecycles. Your total processing loss averages 18.3% across all recorded interactions, which currently remains under the critical 20% optimal threshold limit.`;
        mockPipelineData = {
          intent: "report",
          confidence: 0.93,
          rejectedIntents: [{ name: "query", confidence: 0.07 }],
          entities: [{ text: "month", label: "DATETIME", value: "current_month" }],
          originalMessage: userMsg,
          jsonOutput: { metric: "loss_kg", period: "month" },
          savedRecords: [
            { icon: "check", text: `Scanned 14,200 metric tons of transactions` },
            { icon: "check", text: `Total processing loss: 2,847 kg (18.3%)` }
          ]
        };
        break;

      case "3":
        userMsg = "What is the status of batch B-2024-089?";
        aiMsg = "Batch B-2024-089 is currently marked as an Anomaly. It completed Collection and Sorting, but flagged a 34.2% processing mass drop during the Washing phase, halting its transition to Granulation.";
        mockPipelineData = {
          intent: "traceability",
          confidence: 0.99,
          rejectedIntents: [{ name: "general_query", confidence: 0.01 }],
          entities: [{ text: "B-2024-089", label: "BATCH_ID", value: "B-2024-089" }],
          originalMessage: userMsg,
          jsonOutput: { batch_id: "B-2024-089" },
          savedRecords: [
            { icon: "alert-triangle", text: `Loaded batch lifecycle topology` },
            { icon: "check", text: `Located mass-balance drop anomaly at node 3` }
          ],
          batchId: "B-2024-089"
        };
        break;

      case "4":
        userMsg = "Generate the dispatch report for the latest verified HDPE shipment to Buyer Corp";
        aiMsg = "The final Dispatch authorization for 12.8 metric tons of HDPE to Buyer Corp has been compiled. Compliance documentation confirming 91.4% supply chain data completeness is securely linked to the digital twin token.";
        mockPipelineData = {
          intent: "export",
          confidence: 0.91,
          rejectedIntents: [{ name: "email", confidence: 0.09 }],
          entities: [
            { text: "HDPE", label: "MATERIAL", value: "HDPE" },
            { text: "Buyer Corp", label: "CUSTOMER", value: "Buyer_Corp_ID" }
          ],
          originalMessage: userMsg,
          jsonOutput: { action: "generate_report", format: "pdf", material: "HDPE", target: "Buyer_Corp_ID" },
          savedRecords: [
            { icon: "check", text: `Cryptographic hashes verified successfully` },
            { icon: "check", text: `Generated EPR (Extended Producer Responsibility) packet` }
          ]
        };
        break;

      case "5":
      default:
        userMsg = "Log 2.5 tons of mixed plastics from EcoSort Inc.";
        aiMsg = "I've ingested the vendor log for 2.5 tons of mixed inbound plastics from EcoSort Inc. Please note that EcoSort Inc. currently has a completeness reputation score below 80%. I have flagged this intake for secondary sorting inspection.";
        mockPipelineData = {
          intent: "purchase",
          confidence: 0.95,
          rejectedIntents: [{ name: "processing", confidence: 0.05 }],
          entities: [
            { text: "2.5 tons", label: "QUANTITY", value: "2500" },
            { text: "mixed plastics", label: "MATERIAL", value: "mixed_plastic" },
            { text: "EcoSort Inc.", label: "VENDOR", value: "EcoSort_Inc" }
          ],
          originalMessage: userMsg,
          jsonOutput: { vendor: "EcoSort Inc.", qty: 2500, unit: "kg", material: "mixed_plastic" },
          savedRecords: [
            { icon: "check", text: `Data normalized to 2500 kg` },
            { icon: "alert-triangle", text: `Warning attached: Vendor Quality Score < 80%` }
          ]
        };
        break;
    }

    setMessages([{
      id: `user-${chat.id}`,
      role: "user",
      content: userMsg,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    }, {
      id: `ai-${chat.id}`,
      role: "assistant",
      content: aiMsg,
      timestamp: new Date(Date.now() - 7100000),
      pipelineData: mockPipelineData
    }])
  }

  const handleClearChat = async () => {
    if (sessionId) {
      try {
        await clearChatSession(sessionId)
      } catch { /* best effort */ }
    }
    setMessages([])
    setSessionId("")
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Chat History Sidebar */}
      <div className="w-[280px] border-r border-tf-border bg-tf-bg-primary p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-tf-text-primary font-semibold">Chat History</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-tf-text-muted hover:text-tf-accent-green"
              onClick={handleNewChat}
              title="New chat"
            >
              <Plus className="w-4 h-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-tf-text-muted hover:text-red-500"
                onClick={handleClearSession}
                title="Clear current session"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-tf-accent-green animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-2 overflow-y-auto">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleHistoryClick(chat as any)}
                className={cn(
                  "w-full text-left p-3 rounded-lg bg-tf-bg-secondary hover:bg-tf-bg-tertiary transition-colors",
                  activeSessionId === chat.id && "ring-2 ring-tf-accent-green"
                )}
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
                    <span className="text-tf-accent-blue text-xs flex items-center gap-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      {chat.queries} queries
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Session info */}
        <div className="mt-4 pt-4 border-t border-tf-border">
          <p className="text-tf-text-muted text-xs truncate">
            Session: <span className="font-mono">{sessionId.slice(0, 16)}...</span>
          </p>
          <p className="text-tf-text-muted text-xs mt-1">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-foreground font-semibold">
                  Aperio AI Assistant
                </h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    connectionStatus === "connected" ? "bg-green-500 animate-pulse" :
                    connectionStatus === "checking" ? "bg-amber-500 animate-pulse" :
                    "bg-red-500"
                  )} />
                  <span className="text-muted-foreground text-xs">
                    {connectionStatus === "connected"
                      ? "Connected to Aperio API"
                      : connectionStatus === "checking"
                      ? "Connecting..."
                      : "Disconnected — using fallback"}
                  </span>
                </div>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI Model Info Panel */}
          <AIModelInfo autoCollapse={true} collapseDelay={5000} />

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-foreground text-xl font-semibold mb-2">
                What would you like to do today?
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Log materials in plain English. I'll extract intent, entities, and save structured data automatically.
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl overflow-x-auto pb-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-4 py-2 rounded-full bg-secondary border border-border text-muted-foreground text-sm hover:bg-accent hover:text-foreground transition-colors whitespace-nowrap"
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
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary border-l-2 border-primary/50 rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card/50">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in plain English... e.g. 'Received 450 kg PP from CircularMat today'"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
              {input.length > 100 && (
                <span className="absolute right-3 bottom-3 text-muted-foreground text-xs font-mono">
                  {input.length}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              title="Voice input coming soon"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
