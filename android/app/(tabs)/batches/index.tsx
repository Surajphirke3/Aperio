import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchFromAPI } from '../../../lib/api';
import { Package, ChevronRight } from 'lucide-react-native';

export default function BatchesScreen() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI('/batches/');
      setBatches(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderBatch = ({ item }: { item: any }) => (
    <TouchableOpacity 
      className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center"
      onPress={() => router.push(`/(tabs)/batches/${item.id || item.batch_id}`)}
    >
      <View className="flex-row items-center flex-1">
        <View className="bg-blue-100 p-2 rounded-full mr-3">
          <Package size={20} color="#0ea5e9" />
        </View>
        <View>
          <Text className="font-semibold text-gray-900">{item.batch_id || item.id}</Text>
          <Text className="text-gray-500 text-sm">{item.status || 'Pending'}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <View className="bg-green-100 px-2 py-1 rounded mr-2">
          <Text className="text-green-700 text-xs font-medium">{item.traceability_score || 0}% Traceable</Text>
        </View>
        <ChevronRight size={20} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={batches}
          renderItem={renderBatch}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500">No batches found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}