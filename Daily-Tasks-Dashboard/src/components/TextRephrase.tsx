import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Copy, CheckCircle2, X } from 'lucide-react';

interface TextRephraseProps {
  onClose: () => void;
}

export function TextRephrase({ onClose }: TextRephraseProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const rephraseText = (style: 'friendly' | 'professional' | 'summarize') => {
    if (!inputText.trim()) return;

    // Mock AI rephrasing - in production, this would call an AI API
    let rephrased = '';
    
    if (style === 'friendly') {
      rephrased = `Hey there! 😊 ${inputText.replace(/\./g, '!')} Hope this helps!`;
    } else if (style === 'professional') {
      rephrased = `Dear Sir/Madam,\n\n${inputText}\n\nBest regards,`;
    } else if (style === 'summarize') {
      const words = inputText.split(' ');
      rephrased = words.slice(0, Math.min(15, words.length)).join(' ') + '...';
    }
    
    setOutputText(rephrased);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 h-full flex flex-col">
      <div className="mb-3 flex-shrink-0 flex justify-between items-start">
        <div>
          <h3 className="text-gray-900 mb-1">Text Rephrase</h3>
          <p className="text-gray-500">Transform your messages</p>
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

      {/* Input */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <Textarea
          placeholder="Enter your text to rephrase..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="resize-none bg-white flex-1 min-h-0"
        />

        {/* Style Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={() => rephraseText('friendly')}
            size="sm"
            variant="outline"
            className="flex-1 border-orange-300 hover:bg-orange-50"
          >
            😊 Friendly
          </Button>
          <Button
            onClick={() => rephraseText('professional')}
            size="sm"
            variant="outline"
            className="flex-1 border-blue-300 hover:bg-blue-50"
          >
            💼 Pro
          </Button>
          <Button
            onClick={() => rephraseText('summarize')}
            size="sm"
            variant="outline"
            className="flex-1 border-purple-300 hover:bg-purple-50"
          >
            📝 Short
          </Button>
        </div>

        {/* Output */}
        {outputText && (
          <div className="relative flex-shrink-0">
            <div className="bg-white p-3 rounded-lg border border-gray-200 max-h-[100px] overflow-y-auto">
              <p className="text-gray-900 text-sm whitespace-pre-wrap">{outputText}</p>
            </div>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}