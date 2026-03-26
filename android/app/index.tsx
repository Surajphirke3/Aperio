import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth-context';
import { Shield, Leaf, Activity, ArrowRight } from 'lucide-react-native';

export default function LandingScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Or a splash screen

  if (isAuthenticated) {
    // If already logged in, go straight to dashboard
    // Need a slight delay to avoid state updates during render
    setTimeout(() => router.replace('/(tabs)'), 0);
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Hero Section */}
      <View className="pt-20 pb-10 px-6 bg-white border-b border-gray-100">
        <Text className="text-4xl font-extrabold text-gray-900 text-center mb-4 leading-tight">
          Transparent Lifecycle Intelligence
        </Text>
        <Text className="text-lg text-gray-600 text-center mb-8 px-4 leading-relaxed">
          The unified platform for battery traceability, carbon footprint tracking, and ESG compliance.
        </Text>
        
        <View className="flex-row justify-center space-x-4 mb-10">
          <TouchableOpacity 
            className="bg-blue-600 py-3 px-6 rounded-full flex-row items-center shadow-sm"
            onPress={() => router.push('/login')}
          >
            <Text className="text-white font-semibold mr-2">Get Started</Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Section */}
      <View className="py-12 px-6">
        <Text className="text-2xl font-bold text-center text-gray-900 mb-8">Platform Features</Text>
        
        <View className="bg-white p-6 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-4">
            <Shield size={24} color="#2563eb" />
          </View>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Digital Passports</Text>
          <Text className="text-gray-600 leading-relaxed">
            End-to-end traceability for battery lifecycles, ensuring regulatory compliance and authenticity verification.
          </Text>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-4">
            <Leaf size={24} color="#16a34a" />
          </View>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Carbon Tracking</Text>
          <Text className="text-gray-600 leading-relaxed">
            Real-time monitoring of carbon footprints across manufacturing, transportation, and recycling phases.
          </Text>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
          <View className="bg-purple-100 w-12 h-12 rounded-full items-center justify-center mb-4">
            <Activity size={24} color="#9333ea" />
          </View>
          <Text className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</Text>
          <Text className="text-gray-600 leading-relaxed">
            Leverage our advanced NLP models to query complex supply chain data and identify optimization opportunities.
          </Text>
        </View>
      </View>

      {/* Footer CTA */}
      <View className="bg-blue-900 py-16 px-6 items-center">
        <Text className="text-2xl font-bold text-white text-center mb-4">
          Ready to transform your supply chain?
        </Text>
        <Text className="text-blue-100 text-center mb-8 px-4">
          Join leading manufacturers and recyclers building a sustainable future.
        </Text>
        <TouchableOpacity 
          className="bg-white py-3 px-8 rounded-full shadow-lg"
          onPress={() => router.push('/login')}
        >
          <Text className="text-blue-900 font-bold text-lg">Sign In to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}