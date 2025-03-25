import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, MapPin, Layout, Plus, Heart } from "lucide-react-native";
import { useLocations, useBoards, useToggleLocationFavorite } from "../../src/hooks/useQueries";
import { Location, Board } from "../../src/types";
import { useToast } from "../../src/components/Toast";

const RECENT_ITEMS_LIMIT = 3;

export default function HomePage() {
  const router = useRouter();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const { data: locationsData, refetch: refetchLocations } = useLocations({
    limit: RECENT_ITEMS_LIMIT,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const { data: boardsData, refetch: refetchBoards } = useBoards({
    limit: RECENT_ITEMS_LIMIT,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const toggleFavorite = useToggleLocationFavorite();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchLocations(), refetchBoards()]);
    setRefreshing(false);
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite.mutateAsync(id);
      toast.show("Location updated");
    } catch (error) {
      toast.show("Failed to update location", "error");
    }
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      className="w-64 bg-white rounded-xl shadow-sm border border-gray-100"
      onPress={() => router.push(`/location/${item.id}`)}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-32 rounded-t-xl"
      />
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-[#2D2B3F] flex-1">{item.name}</Text>
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
        </View>
        <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
        {item.category && (
          <View className="mt-2">
            <View className="bg-[#E5E1FF] px-2 py-1 rounded-full self-start">
              <Text className="text-[#6A62B7] text-xs">{item.category}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderBoard = ({ item }: { item: Board }) => (
    <TouchableOpacity
      className="w-64 bg-white rounded-xl shadow-sm border border-gray-100"
      onPress={() => router.push(`/board/${item.id}`)}
    >
      <View className="p-4">
        <Text className="font-semibold text-[#2D2B3F]">{item.name}</Text>
        <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
        <View className="flex-row items-center mt-2">
          <View className="bg-[#E5E1FF] px-2 py-1 rounded-full">
            <Text className="text-[#6A62B7] text-xs">{item.locationCount} locations</Text>
          </View>
          {item.category && (
            <View className="bg-gray-100 px-2 py-1 rounded-full ml-2">
              <Text className="text-gray-600 text-xs">{item.category}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-[#2D2B3F]">Home</Text>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            >
              <Text className="text-lg font-semibold text-[#2D2B3F]">
                {user?.name?.[0] || "U"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mb-6"
            onPress={() => router.push("/search")}
          >
            <Search size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-500">Search locations...</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-[#2D2B3F] mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-[#E5E1FF] rounded-xl p-4 items-center"
              onPress={() => router.push("/locations")}
            >
              <MapPin size={24} color="#6A62B7" />
              <Text className="mt-2 text-[#6A62B7] font-medium">Locations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#E5E1FF] rounded-xl p-4 items-center"
              onPress={() => router.push("/boards")}
            >
              <Layout size={24} color="#6A62B7" />
              <Text className="mt-2 text-[#6A62B7] font-medium">Boards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Locations */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-[#2D2B3F]">Recent Locations</Text>
            <TouchableOpacity onPress={() => router.push("/locations")}>
              <Text className="text-[#6A62B7] font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
            {locationsData?.data.map((location) => renderLocation({ item: location }))}
            {locationsData?.data.length === 0 && (
              <View className="w-64 items-center justify-center py-8">
                <MapPin size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4">No locations yet</Text>
                <TouchableOpacity
                  className="mt-4 bg-[#6A62B7] px-6 py-3 rounded-full"
                  onPress={() => router.push("/add-location")}
                >
                  <Text className="text-white font-medium">Add Location</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Recent Boards */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-[#2D2B3F]">Recent Boards</Text>
            <TouchableOpacity onPress={() => router.push("/boards")}>
              <Text className="text-[#6A62B7] font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
            {boardsData?.data.map((board) => renderBoard({ item: board }))}
            {boardsData?.data.length === 0 && (
              <View className="w-64 items-center justify-center py-8">
                <Layout size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4">No boards yet</Text>
                <TouchableOpacity
                  className="mt-4 bg-[#6A62B7] px-6 py-3 rounded-full"
                  onPress={() => router.push("/add-board")}
                >
                  <Text className="text-white font-medium">Create Board</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-[#6A62B7] rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/add")}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
