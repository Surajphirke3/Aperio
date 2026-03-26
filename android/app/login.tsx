import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, UserRole } from '../lib/auth-context';
import { Mail, Lock, User as UserIcon } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password, role);
      } else {
        await signup(name || email.split('@')[0], email, password, role);
      }
      router.replace('/(tabs)');
    } catch (e) {
      console.error(e);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white justify-center px-6"
    >
      <View className="mb-10">
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </Text>
        <Text className="text-gray-500">
          {isLogin ? 'Enter your credentials to access your workspace' : 'Join Aperio to track your supply chain'}
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        {!isLogin && (
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
            <UserIcon size={20} color="#9ca3af" className="mr-3" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              className="flex-1 text-gray-900 text-base"
              autoCapitalize="words"
            />
          </View>
        )}

        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <Mail size={20} color="#9ca3af" className="mr-3" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            className="flex-1 text-gray-900 text-base"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <Lock size={20} color="#9ca3af" className="mr-3" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            className="flex-1 text-gray-900 text-base"
            secureTextEntry
          />
        </View>

        {/* Role Selector */}
        <View className="mt-2">
          <Text className="text-sm font-medium text-gray-700 mb-2">Select Role:</Text>
          <View className="flex-row space-x-2">
            {(['customer', 'partner', 'regulator'] as UserRole[]).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg items-center border ${role === r ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}`}
              >
                <Text className={`capitalize font-medium ${role === r ? 'text-blue-700' : 'text-gray-600'}`}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity 
        className={`bg-blue-600 py-4 rounded-xl items-center flex-row justify-center ${loading ? 'opacity-70' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" className="mr-2" />
        ) : null}
        <Text className="text-white font-bold text-lg">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </Text>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text className="text-blue-600 font-bold">
            {isLogin ? 'Sign up' : 'Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}