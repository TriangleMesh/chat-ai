import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamMode, setStreamMode] = useState(true) // Default to streaming mode
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim() || loading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setLoading(true)

    if (streamMode) {
      await handleStreamChat(userMessage)
    } else {
      await handleNormalChat(userMessage)
    }
  }

  const handleNormalChat = async (userMessage) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Add AI reply
      setMessages(prev => [...prev, { type: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, the request failed. Please try again later.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleStreamChat = async (userMessage) => {
    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      // Add an empty assistant message for streaming updates
      const messageIndex = messages.length + 1 // +1 because user message is already added
      setMessages(prev => [...prev, { type: 'assistant', content: '' }])
      
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep the last incomplete line
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setLoading(false)
              return
            }
            if (data === '[ERROR]') {
              throw new Error('Stream error')
            }
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setMessages(prev => {
                  const newMessages = [...prev]
                  if (newMessages[messageIndex]) {
                    newMessages[messageIndex].content += parsed.content
                  }
                  return newMessages
                })
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, the streaming request failed. Please try again later.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h1>Chat AI Demo</h1>
              <p>Welcome! This is a simple chat interface to interact with an AI assistant. </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
                </div>
                <div className="message-text">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="message-avatar">🤖</div>
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <div className="mode-toggle">
            <label>
              <input
                type="checkbox"
                checked={streamMode}
                onChange={(e) => setStreamMode(e.target.checked)}
              />
              Streaming Response
            </label>
          </div>
          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="message-input"
                rows={1}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={loading || !inputValue.trim()}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
