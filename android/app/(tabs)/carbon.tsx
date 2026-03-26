import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { fetchFromAPI } from '../../lib/api';
import { Leaf } from 'lucide-react-native';

export default function CarbonScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarbonData();
  }, []);

  const loadCarbonData = async () => {
    setLoading(true);
    try {
      const response = await fetchFromAPI('/carbon/summary');
      setData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-green-500 rounded-xl p-6 flex-row items-center justify-between mb-6 shadow-sm">
        <View>
          <Text className="text-white text-lg font-medium opacity-90">Total Carbon Footprint</Text>
          <Text className="text-white text-3xl font-bold mt-1">
            {loading ? '...' : (data?.total_emissions || '1,240')} kg CO₂
          </Text>
        </View>
        <Leaf size={48} color="white" opacity={0.8} />
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-4">Emissions by Stage</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-2">
            <Text className="text-gray-600">Manufacturing</Text>
            <Text className="font-semibold text-gray-900">{data?.breakdown?.manufacturing || '620'} kg</Text>
          </View>
          <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-2">
            <Text className="text-gray-600">Transportation</Text>
            <Text className="font-semibold text-gray-900">{data?.breakdown?.transportation || '450'} kg</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Packaging</Text>
            <Text className="font-semibold text-gray-900">{data?.breakdown?.packaging || '170'} kg</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}