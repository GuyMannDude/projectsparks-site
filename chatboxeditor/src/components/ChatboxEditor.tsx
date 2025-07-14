import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from './SpeechRecognition';

const ChatboxEditor: React.FC = () => {
  const [text, setText] = useState('');
  const { toast } = useToast();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      setText(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleRecordingToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendToChat = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setText('');
      toast({
        title: "Success",
        description: "Text copied to clipboard and cleared"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 drop-shadow-sm">
          ChatboxEditor
        </h1>
      </div>
      
      <div className="flex-1 mb-6">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Transcribed text..."
          className="w-full h-full resize-none border-2 border-blue-200 focus:border-blue-500 text-base bg-white/80 backdrop-blur-sm shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl"
          readOnly={isListening}
        />
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={handleRecordingToggle}
          className={`flex-1 py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200'
          }`}
        >
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </Button>
        
        <Button
          onClick={handleSendToChat}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all duration-200 transform hover:scale-105"
          disabled={!text.trim()}
        >
          Send to Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatboxEditor;