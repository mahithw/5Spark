import { useState } from 'react';
import { Card } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface MoodTrackerProps {
  onMoodChange: (mood: number, emoji: string, moodType: 'energized' | 'happy' | 'neutral' | 'sad' | 'stressed') => void;
  currentMood: number;
  onClose: () => void;
}

export function MoodTracker({ onMoodChange, currentMood, onClose }: MoodTrackerProps) {
  const [moodData, setMoodData] = useState<MoodEntry[]>([
    { date: 'Mon', mood: 4, emoji: '😊' },
    { date: 'Tue', mood: 3, emoji: '😐' },
    { date: 'Wed', mood: 5, emoji: '😄' },
    { date: 'Thu', mood: 4, emoji: '😊' },
    { date: 'Fri', mood: 4, emoji: '😊' },
  ]);

  const handleMoodSelect = (mood: number, emoji: string, moodType: 'energized' | 'happy' | 'neutral' | 'sad' | 'stressed') => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const existingIndex = moodData.findIndex((entry) => entry.date === today);
    
    if (existingIndex >= 0) {
      const newData = [...moodData];
      newData[existingIndex] = { date: today, mood, emoji };
      setMoodData(newData);
    } else {
      setMoodData([...moodData, { date: today, mood, emoji }]);
    }
    
    // Update the mood in the parent component
    onMoodChange(mood, emoji, moodType);
  };

  const averageMood = moodData.length > 0 
    ? (moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length).toFixed(1)
    : '0';

  return (
    <Card className="p-4 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 h-full flex flex-col">
      <div className="mb-3 flex-shrink-0 flex justify-between items-start">
        <div>
          <h3 className="text-gray-900 mb-1">How are you feeling today?</h3>
          <p className="text-gray-500">Track your mood throughout the week</p>
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

      {/* Mood Selection */}
      <div className="flex justify-between mb-4 flex-shrink-0">
        {moodOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleMoodSelect(option.value, option.emoji, option.moodType)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/50 transition-all hover:scale-110"
            title={option.label}
          >
            <span className="text-2xl">{option.emoji}</span>
          </button>
        ))}
      </div>

      {/* Mood Graph */}
      <div className="mb-3 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as MoodEntry;
                  return (
                    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                      <p className="text-sm">{data.emoji} {data.date}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#a855f7" 
              strokeWidth={3}
              dot={{ fill: '#a855f7', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center p-2 bg-white/70 rounded-lg flex-shrink-0">
        <p className="text-gray-600">Average Mood</p>
        <p className="text-purple-600">{averageMood} / 5.0</p>
      </div>
    </Card>
  );
}