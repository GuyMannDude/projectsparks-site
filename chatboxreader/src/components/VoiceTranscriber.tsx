import React, { useState, useRef, useEffect } from 'react';

const VoiceTranscriber: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const bufferRef = useRef('');
  const chatSelector = '#chat-input'; // Editable selector

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          bufferRef.current += finalTranscript;
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setIsPaused(false);
    }
  };

  const pauseListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsPaused(true);
    }
  };

  const sendToChat = async () => {
    const textToSend = transcript || bufferRef.current;
    if (!textToSend.trim()) return;

    try {
      // Send text to buffer (copy to clipboard)
      await navigator.clipboard.writeText(textToSend);
      
      // Try to find chat input and send
      const chatInput = document.querySelector(chatSelector) as HTMLInputElement;
      if (chatInput) {
        chatInput.value = textToSend;
        chatInput.focus();
        
        // Dispatch Enter key
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          bubbles: true
        });
        chatInput.dispatchEvent(enterEvent);
      }
      
      // Clear the text input box (transcript)
      setTranscript('');
      bufferRef.current = '';
    } catch (error) {
      console.error('Error sending to chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 flex flex-col font-poppins">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-orbitron animate-pulse">
        Chatbox Editor – Transcribe, edit, & send
      </h1>
      
      <textarea
        id="transcriptBox"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="flex-1 w-full p-6 text-lg md:text-xl bg-gray-800/50 border-2 border-cyan-400/50 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-400 focus:glow-cyan backdrop-blur-sm transition-all duration-300"
        placeholder="Your transcribed text will appear here..."
      />
      
      <div className="mt-8 flex flex-col items-center space-y-6">
        <div className="flex space-x-6">
          <button
            id="startBtn"
            onClick={isListening ? pauseListening : startListening}
            className={`w-20 h-20 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-110 active:scale-95 text-sm ${
              isListening 
                ? 'bg-amber-500 hover:bg-amber-400 glow-amber hover:shadow-2xl'
                : 'bg-green-500 hover:bg-green-400 glow-green hover:shadow-2xl'
            }`}
          >
            {isListening ? 'Pause' : 'Start'}
          </button>
        </div>
        
        <button
          id="sendBtn"
          onClick={sendToChat}
          className="w-80 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 glow-purple hover:shadow-2xl text-lg"
        >
          Send to Chat
        </button>
      </div>
    </div>
  );
};

export default VoiceTranscriber;