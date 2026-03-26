import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { fetchFromAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import { LogOut, User as UserIcon, AlertTriangle, Bot, Activity, CheckCircle, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock Data for fallback
const mockKpi = {
  total_tracked: 18420,
  avg_completeness: 91.4,
  active_batches: 12,
  critical_batches: 3,
  co2_saved_t: 3.204
};

const mockAnomalies = [
  { id: "a1", severity: "critical", message: "Batch B-2024-089 — PET processing loss 34.2% (threshold: 20%)", timestamp: "2 hours ago" },
  { id: "a2", severity: "warning", message: "Vendor GreenCycle Industries — No delivery recorded in 8 days", timestamp: "4 hours ago" }
];

export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, anomaliesData] = await Promise.all([
        fetchFromAPI('/stats/'),
        fetchFromAPI('/anomalies/')
      ]);
      setStats(statsData);
      setAnomalies(anomaliesData?.anomalies || []);
    } catch (e) {
      console.error('Failed to load stats', e);
      setStats(mockKpi);
      setAnomalies(mockAnomalies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-gray-50 p-4"
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-sm text-gray-500">Welcome back,</Text>
          <Text className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-white p-2 rounded-full shadow-sm border border-gray-100"
        >
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      
      <Text className="text-xl font-bold text-gray-900 mb-4">Overview</Text>
      
      <View className="flex-row flex-wrap justify-between mb-4">
        <View className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 border border-gray-100">
          <Text className="text-sm text-gray-500 mb-1">Total Tracked</Text>
          <Text className="text-xl font-bold text-green-600">{stats?.total_tracked || '---'} kg</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 border border-gray-100">
          <Text className="text-sm text-gray-500 mb-1">Avg Completeness</Text>
          <Text className="text-xl font-bold text-blue-600">{stats?.avg_completeness || '---'}%</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 border border-gray-100">
          <Text className="text-sm text-gray-500 mb-1">Active Batches</Text>
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-gray-900 mr-2">{stats?.active_batches || '---'}</Text>
            {stats?.critical_batches > 0 && (
              <View className="bg-red-100 px-2 py-0.5 rounded text-xs">
                <Text className="text-red-700 text-xs font-bold">{stats?.critical_batches} critical</Text>
              </View>
            )}
          </View>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm w-[48%] mb-4 border border-gray-100">
          <Text className="text-sm text-gray-500 mb-1">CO₂ Saved</Text>
          <Text className="text-xl font-bold text-teal-600">
            {stats?.co2_saved_t ? (stats.co2_saved_t * 1000).toFixed(0) : '---'} kg
          </Text>
        </View>
      </View>

      {/* Anomalies Panel */}
      {(user?.role === 'regulator' || user?.role === 'partner') && anomalies.length > 0 && (
        <View className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-red-500 mb-6">
          <View className="flex-row items-center mb-3">
            <AlertTriangle size={20} color="#ef4444" className="mr-2" />
            <Text className="text-lg font-bold text-gray-900">Active Anomalies</Text>
          </View>
          {anomalies.map((anomaly, idx) => (
            <View key={idx} className={`py-3 ${idx !== anomalies.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <View className="flex-row items-start">
                <View className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${anomaly.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{anomaly.message}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{anomaly.timestamp}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* AI Insights Mock */}
      <View className="bg-green-50 p-5 rounded-2xl border border-green-200 mb-8 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Bot size={20} color="#16a34a" className="mr-2" />
          <Text className="text-lg font-bold text-green-900">Aperio AI Insights</Text>
        </View>
        <Text className="text-green-800 leading-relaxed">
          This week's throughput shows strong PET recovery rates averaging 87.3% across 5 active batches. However, Batch B-2024-089 exhibits anomalous processing loss of 34.2% — 14 percentage points above the historical average.
        </Text>
        <TouchableOpacity 
          className="mt-4 bg-green-600 py-2 px-4 rounded-lg self-start"
          onPress={() => router.push('/(tabs)/chat')}
        >
          <Text className="text-white font-medium">Ask AI Assistant</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}