import { MoodTracker } from './MoodTracker';
import { PlutoAssistant } from './PlutoAssistant';
import { TextRephrase } from './TextRephrase';
import { useState } from 'react';

interface RightSidebarProps {
  onMoodChange: (mood: number, emoji: string, moodType: 'energized' | 'happy' | 'neutral' | 'sad' | 'stressed') => void;
  currentMood: number;
}

export function RightSidebar({ onMoodChange, currentMood }: RightSidebarProps) {
  const [expandedBox, setExpandedBox] = useState<'mood' | 'pluto' | 'rephrase' | null>(null);

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden p-4 gap-4">
      {expandedBox === null ? (
        // Show all 3 boxes collapsed with just titles
        <>
          <div 
            onClick={() => setExpandedBox('mood')}
            className="flex-1 min-h-0 cursor-pointer hover:bg-gray-50 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center transition-all"
          >
            <div className="text-center">
              <h3 className="text-gray-900 mb-1">Mood Tracker</h3>
              <p className="text-gray-500">Track your feelings</p>
            </div>
          </div>
          <div 
            onClick={() => setExpandedBox('pluto')}
            className="flex-1 min-h-0 cursor-pointer hover:bg-gray-50 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 flex items-center justify-center transition-all"
          >
            <div className="text-center">
              <h3 className="text-gray-900 mb-1">Chat with Pluto</h3>
              <p className="text-gray-500">Your AI companion</p>
            </div>
          </div>
          <div 
            onClick={() => setExpandedBox('rephrase')}
            className="flex-1 min-h-0 cursor-pointer hover:bg-gray-50 rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center transition-all"
          >
            <div className="text-center">
              <h3 className="text-gray-900 mb-1">Text Rephrase</h3>
              <p className="text-gray-500">Transform messages</p>
            </div>
          </div>
        </>
      ) : (
        // Show expanded box
        <div className="flex-1 min-h-0 flex flex-col">
          {expandedBox === 'mood' && (
            <MoodTracker 
              onMoodChange={onMoodChange} 
              currentMood={currentMood}
              onClose={() => setExpandedBox(null)}
            />
          )}
          {expandedBox === 'pluto' && (
            <PlutoAssistant onClose={() => setExpandedBox(null)} />
          )}
          {expandedBox === 'rephrase' && (
            <TextRephrase onClose={() => setExpandedBox(null)} />
          )}
        </div>
      )}
    </div>
  );
}