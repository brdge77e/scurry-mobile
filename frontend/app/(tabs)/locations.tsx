import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, MapPin, Plus, Filter, Heart, Share2 } from "lucide-react-native";
import { useLocations, useToggleLocationFavorite, useShareLocation } from "../../src/hooks/useQueries";
import { Location } from '../../src/types/index';
import { useToast } from "../../src/components/Toast";

const ITEMS_PER_PAGE = 10;

export default function LocationsPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useLocations({
    query: searchQuery,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const toggleFavorite = useToggleLocationFavorite();
  const shareLocation = useShareLocation();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (data?.pagination.totalPages > page) {
      setPage(page + 1);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite.mutateAsync(id);
      toast.show("Location updated");
    } catch (error) {
      toast.show("Failed to update location", "error");
    }
  };

  const handleShare = async (id: string) => {
    try {
      await shareLocation.mutateAsync({ id, email: "" }); // You might want to show a modal to get the email
      toast.show("Location shared successfully");
    } catch (error) {
      toast.show("Failed to share location", "error");
    }
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 m-1"
      onPress={() => router.push(`/location/${item.id}`)}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-40 rounded-t-xl"
      />
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-[#2D2B3F] flex-1">{item.name}</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => handleToggleFavorite(item.id)}
              className="p-2"
            >
              <Heart
                size={20}
                color={item.isFavorite ? "#EF4444" : "#9CA3AF"}
                fill={item.isFavorite ? "#EF4444" : "none"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare(item.id)}
              className="p-2"
            >
              <Share2 size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
        {item.category && (
          <View className="mt-2 flex-row flex-wrap">
            <View className="bg-[#E5E1FF] px-2 py-1 rounded-full mr-2">
              <Text className="text-[#6A62B7] text-xs">{item.category}</Text>
            </View>
            {item.tags.map((tag, index) => (
              <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2">
                <Text className="text-gray-600 text-xs">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-red-500 text-center mb-4">Failed to load locations</Text>
          <TouchableOpacity
            className="bg-[#6A62B7] px-6 py-3 rounded-full"
            onPress={() => refetch()}
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-[#2D2B3F]">Locations</Text>
          <TouchableOpacity
            onPress={() => router.push("/add-location")}
            className="w-10 h-10 rounded-full bg-[#E5E1FF] items-center justify-center"
          >
            <Plus size={20} color="#6A62B7" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row space-x-2 mb-6">
          <TouchableOpacity
            className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3"
            onPress={() => router.push("/search")}
          >
            <Search size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-500">Search locations...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-12 h-12 bg-[#E5E1FF] rounded-full items-center justify-center"
            onPress={() => router.push("/filters")}
          >
            <Filter size={20} color="#6A62B7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Locations Grid */}
      <FlatList
        data={data?.data}
        renderItem={renderLocation}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View className="py-4">
              <ActivityIndicator color="#6A62B7" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator color="#6A62B7" />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <MapPin size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">No locations found</Text>
              <TouchableOpacity
                className="mt-4 bg-[#6A62B7] px-6 py-3 rounded-full"
                onPress={() => router.push("/add-location")}
              >
                <Text className="text-white font-medium">Add Location</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
} 