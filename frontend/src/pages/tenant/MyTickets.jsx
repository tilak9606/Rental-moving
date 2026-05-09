import React, { useState, useEffect } from 'react'
import { supportService } from '../../services/supportService.js'
import { MessageSquare, Plus, Clock, Send } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const MyTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [ticketForm, setTicketForm] = useState({
    title: '', description: '', category: 'maintenance', priority: 'medium', propertyId: ''
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const { data } = await supportService.getMyTickets()
      setTickets(data)
    } catch {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await supportService.createTicket(ticketForm)
      toast.success('Ticket created')
      setShowCreate(false)
      setTicketForm({ title: '', description: '', category: 'maintenance', priority: 'medium', propertyId: '' })
      fetchTickets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket')
    }
  }

  const openTicket = async (ticket) => {
    setSelectedTicket(ticket)
    try {
      const { data } = await supportService.getTicketById(ticket._id)
      setMessages(data.messages)
    } catch {
      toast.error('Failed to load messages')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    try {
      await supportService.addMessage(selectedTicket._id, newMessage)
      setNewMessage('')
      openTicket(selectedTicket)
    } catch {
      toast.error('Failed to send message')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Support Tickets</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tickets yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openTicket(ticket)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{ticket.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="capitalize">{ticket.category}</span>
                    <StatusBadge status={ticket.status} />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Support Ticket</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="input-field"
                value={ticketForm.title}
                onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Describe your issue..."
                className="input-field h-32 resize-none"
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="input-field"
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="billing">Billing</option>
                  <option value="complaint">Complaint</option>
                  <option value="general">General</option>
                </select>
                <select
                  className="input-field"
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full h-[80vh] flex flex-col animate-fade-in-up">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedTicket.title}</h3>
                <StatusBadge status={selectedTicket.status} />
              </div>
              <button onClick={() => setSelectedTicket(null)} className="btn-ghost">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.sender?._id === selectedTicket.tenant ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender?._id === selectedTicket.tenant ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <span className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="btn-primary">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyTickets