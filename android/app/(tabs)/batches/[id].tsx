import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchFromAPI } from '../../../lib/api';
import { MapPin, Info, Box, Bot, Activity, CheckCircle, Package, Truck, Factory, Calendar } from 'lucide-react-native';

const mockBatchDetails = {
  id: "B-2024-089",
  material: "PET Bottles",
  vendor: "GreenCycle Industries",
  status: "anomaly",
  completeness: 72,
  inputKg: 4200,
  outputKg: 2940,
  lossKg: 760,
  date: "Mar 18",
  origin: "Mumbai Central Depot",
  supplier: "GreenCycle Industries"
};

const mockTimeline = [
  { stage: "COLLECTION", timestamp: "Mar 18, 09:00 AM", status: "complete" },
  { stage: "SORTING", timestamp: "Mar 18, 02:00 PM", status: "complete" },
  { stage: "PROCESSING", timestamp: "Mar 19, 10:00 AM", status: "anomaly" },
  { stage: "GRANULATION", timestamp: "Pending", status: "pending" }
];

export default function BatchDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatchDetails();
  }, [id]);

  const loadBatchDetails = async () => {
    try {
      const data = await fetchFromAPI(`/batches/${id}`);
      setBatch(data || mockBatchDetails);
    } catch (e) {
      console.error(e);
      setBatch(mockBatchDetails);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!batch) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Batch details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Header Info */}
      <View className="bg-white p-6 rounded-2xl shadow-sm mb-4">
        <View className="flex-row items-center mb-4">
          <View className="bg-blue-100 p-3 rounded-full mr-4">
            <Box size={24} color="#0ea5e9" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-900">{batch.batch_id || id}</Text>
            <Text className="text-gray-500">{batch.material || 'Material Type'}</Text>
          </View>
        </View>

        <View className="flex-row justify-between pt-4 border-t border-gray-100">
          <View>
            <Text className="text-xs text-gray-500 mb-1">Status</Text>
            <Text className="font-semibold text-gray-900">{batch.status || 'Active'}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500 mb-1">Traceability Score</Text>
            <Text className="font-semibold text-green-600">{batch.traceability_score || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Origin Info */}
      <Text className="text-lg font-bold text-gray-900 mb-3 px-1">Origin Details</Text>
      <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
        <View className="flex-row items-start mb-3">
          <MapPin size={20} color="#64748b" className="mr-3 mt-1" />
          <View>
            <Text className="text-sm text-gray-500">Source Location</Text>
            <Text className="font-medium text-gray-900">{batch.origin || 'Unknown Location'}</Text>
          </View>
        </View>
        <View className="flex-row items-start">
          <Info size={20} color="#64748b" className="mr-3 mt-1" />
          <View>
            <Text className="text-sm text-gray-500">Supplier</Text>
            <Text className="font-medium text-gray-900">{batch.supplier || 'Unknown Supplier'}</Text>
          </View>
        </View>
      </View>
      
      {/* Add more sections as per Next.js frontend (e.g., chain of custody, compliance) */}
      
      {/* Timeline */}
      <Text className="text-lg font-bold text-gray-900 mb-3 px-1 mt-2">Batch Timeline</Text>
      <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
        {mockTimeline.map((item, index) => (
          <View key={index} className="flex-row mb-4">
            <View className="items-center mr-4">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                item.status === 'complete' ? 'bg-green-100' :
                item.status === 'anomaly' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {item.status === 'complete' && <CheckCircle size={16} color="#16a34a" />}
                {item.status === 'anomaly' && <Activity size={16} color="#ef4444" />}
                {item.status === 'pending' && <Clock size={16} color="#9ca3af" />}
              </View>
              {index !== mockTimeline.length - 1 && (
                <View className="w-0.5 h-full bg-gray-200 mt-2" />
              )}
            </View>
            <View className="flex-1 pb-4">
              <Text className="text-sm font-bold text-gray-900">{item.stage}</Text>
              <Text className="text-xs text-gray-500 mt-1">{item.timestamp}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* AI Insight Box */}
      <View className="bg-green-50 p-5 rounded-2xl border border-green-200 mb-8 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Bot size={20} color="#16a34a" className="mr-2" />
          <Text className="text-lg font-bold text-green-900">Batch Intelligence Report</Text>
        </View>
        <Text className="text-green-800 leading-relaxed text-sm">
          Batch {batch.id} shows strong collection and sorting performance. However, the processing stage recorded a loss of 34.0% — significantly above the 20% anomaly threshold. Recommend: (1) Review shredder calibration logs, (2) Complete remaining stage entries, (3) Cross-check with vendor delivery note.
        </Text>
      </View>
    </ScrollView>
  );
}