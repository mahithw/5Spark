import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sparkles, Send, X } from 'lucide-react';

interface PlutoAssistantProps {
  onClose: () => void;
}

export function PlutoAssistant({ onClose }: PlutoAssistantProps) {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'pluto'; text: string }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePlutoClick = () => {
    setIsActive(!isActive);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = message;
    setConversation([...conversation, { role: 'user', text: userMessage }]);
    setMessage('');

    // Simple AI response simulation
    setTimeout(() => {
      let response = "Woof! 🐾 I'm Pluto, here to brighten your day!";
      
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = "Woof woof! 🐾 Hi there! I'm Pluto, your friendly companion. How can I help you today?";
      } else if (userMessage.toLowerCase().includes('task') || userMessage.toLowerCase().includes('work')) {
        response = "I see you're working hard! Remember to take breaks and stay hydrated. You're doing great! 🐕💙";
      } else if (userMessage.toLowerCase().includes('tired') || userMessage.toLowerCase().includes('stressed')) {
        response = "I understand! Take a deep breath. Maybe stretch a bit or take a short walk. I'll be here cheering you on! 🌟";
      } else if (userMessage.toLowerCase().includes('help')) {
        response = "I'm here to be your companion and offer encouragement! Tell me how you're feeling or what's on your mind. 💙";
      } else if (userMessage.toLowerCase().includes('good') || userMessage.toLowerCase().includes('great') || userMessage.toLowerCase().includes('happy')) {
        response = "That's wonderful! Your positive energy makes my tail wag! Keep up the amazing work! 🎉🐕";
      } else {
        response = "Thanks for chatting with me! I may be a virtual pup, but I'm always here to listen and support you! 🐾💙";
      }
      
      setConversation(prev => [...prev, { role: 'pluto', text: response }]);
    }, 800);
  };

  // Extract bottom right dog from the image (cropped portion)
  return (
    <Card className="p-4 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 h-full flex flex-col">
      <div className="mb-3 flex-shrink-0 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-900">Chat with Pluto</h3>
          </div>
          <p className="text-gray-500">Your friendly AI companion</p>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Pluto Image */}
      <div className="flex justify-center mb-3 flex-shrink-0">
        <button
          onClick={handlePlutoClick}
          className={`relative transition-all duration-500 hover:scale-105 cursor-pointer rounded-full overflow-hidden ${
            isAnimating ? 'animate-bounce' : ''
          } ${isActive ? 'scale-105 ring-4 ring-blue-300' : ''}`}
          style={{
            width: '100px',
            height: '100px',
          }}
        >
          <img
            src="figma:asset/9df39dc68e36fa21cdbb1ffaea2846d167c69afd.png"
            alt="Pluto"
            className="w-full h-full object-cover"
            style={{
              objectPosition: '75% 75%',
            }}
          />
        </button>
      </div>

      {isActive && (
        <div className="flex-1 flex flex-col min-h-0 gap-3">
          {/* Conversation History */}
          {conversation.length > 0 && (
            <div className="bg-white/70 rounded-lg p-3 flex-1 overflow-y-auto space-y-2 min-h-0">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm p-2 rounded ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-blue-900 ml-4'
                      : 'bg-gradient-to-r from-cyan-50 to-blue-50 text-gray-900 mr-4 border border-blue-200'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-2 flex-shrink-0">
            <Textarea
              placeholder="Talk to Pluto..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="resize-none bg-white"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              className="w-full bg-blue-500 hover:bg-blue-600"
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Pluto
            </Button>
          </div>
        </div>
      )}

      {!isActive && (
        <p className="text-center text-gray-500 text-sm flex-shrink-0">Click Pluto to start chatting! 🐾</p>
      )}
    </Card>
  );
}