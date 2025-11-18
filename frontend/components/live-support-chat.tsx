"use client"

import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, Sparkles, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  type: "user" | "agent"
  content: string
  timestamp: string
}

const suggestedResponses = [
  "My screen is completely black",
  "The device won't turn on at all",
  "I need urgent assistance please",
  "When can someone pick this up?",
]

const initialMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "Hi, my Premium Mobile screen stopped working yesterday.",
    timestamp: "2:30 PM",
  },
  {
    id: "2",
    type: "agent",
    content: "I understand. Let me help you with that right away.",
    timestamp: "11:24 PM",
  },
]

export function LiveSupportChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isAIResponding, setIsAIResponding] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAIResponding) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    const userMessage = inputValue
    setMessages(prev => [...prev, newMessage])
    setInputValue("")
    setIsAIResponding(true)

    try {
      // Call AI API
      const response = await api.sendChatMessage(userMessage)
      
      // Add AI response to messages
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: response.response || "I understand your concern. Let me help you with that.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('AI API Error:', error)
      
      // Fallback response if AI fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "Thank you for your message. Our support team will get back to you shortly. In the meantime, you can create a support ticket for detailed assistance.",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages(prev => [...prev, fallbackResponse])
      
      toast({
        title: "AI Service Unavailable",
        description: "Using fallback response. Our team will assist you soon.",
        duration: 3000,
      })
    } finally {
      setIsAIResponding(false)
    }
  }

  const handleSuggestedResponse = (response: string) => {
    setInputValue(response)
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border">
      {/* Header */}
      <div className="border-b p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Live Support Chat</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-muted-foreground">Agent Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Gold</span>
          <span className="text-foreground font-medium">John Doe</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "agent" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-lg max-w-xs ${message.type === "user" ? "bg-foreground text-background" : "bg-muted text-foreground"
                  }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">{message.timestamp}</span>
            </div>
            {message.type === "user" && (
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        ))}
        
        {/* AI Thinking Indicator */}
        {isAIResponding && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="flex flex-col items-start">
              <div className="px-4 py-3 rounded-lg bg-muted text-foreground">
                <p className="text-sm">AI is thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Responses */}
      <div className="border-t p-6 bg-purple-50 dark:bg-purple-950/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-semibold text-purple-600">Quick Questions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedResponse(response)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-left text-sm text-foreground"
            >
              <Send className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span>{response}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-6 bg-background">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isAIResponding && handleSendMessage()}
            placeholder="Type your response..."
            className="flex-1 px-4 py-3 bg-muted border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isAIResponding || !inputValue.trim()}
            className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAIResponding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
