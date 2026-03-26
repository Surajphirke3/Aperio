import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send, Bot, User as UserIcon, Trash2 } from 'lucide-react-native';
import { sendChatMessage, getChatHistory, clearChatSession } from '../../lib/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory();
      if (history && history.messages) {
        setMessages(history.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);
    
    try {
      const response = await sendChatMessage(userMsg.content);
      if (response && response.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
      } else if (response && response.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.error }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    try {
      await clearChatSession();
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.role === 'user';
    return (
      <View className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
            <Bot size={16} color="#0ea5e9" />
          </View>
        )}
        <View className={`p-4 rounded-2xl max-w-[80%] ${isUser ? 'bg-blue-600 rounded-tr-sm' : 'bg-gray-100 rounded-tl-sm'}`}>
          <Text className={isUser ? 'text-white' : 'text-gray-900 leading-relaxed'}>{item.content}</Text>
        </View>
        {isUser && (
          <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center ml-2">
            <UserIcon size={16} color="#64748b" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100 bg-white">
        <Text className="text-lg font-bold text-gray-900">Aperio AI Assistant</Text>
        <TouchableOpacity onPress={handleClearSession} className="p-2">
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {loading && (
        <View className="p-2 items-center">
          <ActivityIndicator size="small" color="#0ea5e9" />
        </View>
      )}

      <View className="flex-row p-3 border-t border-gray-200 bg-white items-center">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask Aperio AI..."
          className="flex-1 bg-gray-100 p-3 rounded-full mr-2 text-gray-900"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          onPress={sendMessage}
          disabled={loading || !inputText.trim()}
          className={`p-3 rounded-full ${inputText.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}