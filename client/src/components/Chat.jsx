import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { Send, Loader, Clock, Check, CheckCheck } from 'lucide-react';

const Chat = ({ appointmentId, teacherId, studentId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [messageStatuses, setMessageStatuses] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await customFetch.get(`/messages/${appointmentId}`);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    const tempId = Date.now();
    
    try {
      const receiverId = currentUser.role === 'teacher' ? studentId : teacherId;
      
      setMessages(prev => [...prev, {
        _id: tempId,
        content: newMessage,
        sender: currentUser.userId,
        senderModel: currentUser.role === 'teacher' ? 'Teacher' : 'User',
        status: 'sending',
        createdAt: new Date()
      }]);

      const { data } = await customFetch.post('/messages/send', {
        receiverId,
        content: newMessage,
        appointmentId
      });

      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...data.message, status: 'sent' } : msg
      ));
      
      setNewMessage('');

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg._id === data.message._id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 2000);

    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...msg, status: 'failed' } : msg
      ));
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'failed':
        return <Clock className="h-3 w-3 text-red-500" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const isTeacherMessage = (message) => {
    return message.senderModel === 'Teacher';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white/50 backdrop-blur-sm rounded-lg">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-md rounded-t-lg">
        <h3 className="text-lg font-semibold text-white">Messages</h3>
        <p className="text-sm text-blue-100">
          {currentUser.role === 'teacher' ? 'Chat with Student' : 'Chat with Teacher'}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
        {messages.map((message) => {
          const isTeacher = isTeacherMessage(message);
          const isSender = message.sender === currentUser.userId;
          const shouldAlignRight = (isTeacher && currentUser.role === 'teacher') || (!isTeacher && currentUser.role === 'user');

          return (
            <div
              key={message._id}
              className={`flex ${shouldAlignRight ? 'justify-end' : 'justify-start'} w-full`}
            >
              {/* Message Container */}
              <div className={`flex items-end gap-2 max-w-[80%] ${shouldAlignRight ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white
                  ${isTeacher ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}
                >
                  {isTeacher ? 'T' : 'S'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    shouldAlignRight
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-between mt-1 space-x-1 text-xs ${
                    shouldAlignRight ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {isSender && (
                      <div className="flex items-center space-x-0.5">
                        {getMessageStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white/50 backdrop-blur-sm rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input flex-1 bg-white/70 focus:bg-white transition-colors text-sm border-white focus:border-white"
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm px-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:opacity-90"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <Loader className="animate-spin h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 