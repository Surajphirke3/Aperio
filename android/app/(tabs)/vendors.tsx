import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchFromAPI } from '../../lib/api';
import { Users, Star, ChevronRight } from 'lucide-react-native';

export default function VendorsScreen() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI('/vendors/');
      setVendors(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderVendor = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center flex-1">
          <View className="bg-purple-100 p-2 rounded-full mr-3">
            <Users size={20} color="#9333ea" />
          </View>
          <View>
            <Text className="font-semibold text-gray-900 text-lg">{item.name || 'Vendor Name'}</Text>
            <Text className="text-gray-500 text-sm">{item.tier || 'Tier 1'} Supplier</Text>
          </View>
        </View>
        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded">
          <Star size={14} color="#eab308" fill="#eab308" />
          <Text className="text-yellow-700 ml-1 font-medium">{item.rating || '4.5'}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mt-2 pt-3 border-t border-gray-100">
        <View>
          <Text className="text-xs text-gray-500">Compliance</Text>
          <Text className="text-sm font-medium text-green-600">{item.compliance_score || '98'}%</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Active Batches</Text>
          <Text className="text-sm font-medium text-gray-900">{item.active_batches || '12'}</Text>
        </View>
        <View className="justify-center">
          <ChevronRight size={20} color="#94a3b8" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendor}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500">No vendors found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}