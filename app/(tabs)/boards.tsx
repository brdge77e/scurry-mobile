import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, Layout, Plus, Filter, Share2, Users } from "lucide-react-native";
import { useBoards, useShareBoard, useAddCollaborator } from "../../src/hooks/useQueries";
import { Board } from "../../src/types";
import { useToast } from "../../src/components/Toast";

const ITEMS_PER_PAGE = 10;

export default function BoardsPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useBoards({
    query: searchQuery,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const shareBoard = useShareBoard();
  const addCollaborator = useAddCollaborator();

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

  const handleShare = async (id: string) => {
    try {
      await shareBoard.mutateAsync({ id, email: "" }); // You might want to show a modal to get the email
      toast.show("Board shared successfully");
    } catch (error) {
      toast.show("Failed to share board", "error");
    }
  };

  const handleAddCollaborator = async (id: string) => {
    try {
      await addCollaborator.mutateAsync({ id, email: "" }); // You might want to show a modal to get the email
      toast.show("Collaborator added successfully");
    } catch (error) {
      toast.show("Failed to add collaborator", "error");
    }
  };

  const renderBoard = ({ item }: { item: Board }) => (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
      onPress={() => router.push(`/board/${item.id}`)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="font-semibold text-[#2D2B3F] text-lg">{item.name}</Text>
          <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
        </View>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => handleAddCollaborator(item.id)}
            className="p-2"
          >
            <Users size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShare(item.id)}
            className="p-2"
          >
            <Share2 size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center mt-4">
        <View className="bg-[#E5E1FF] px-3 py-1 rounded-full">
          <Text className="text-[#6A62B7] text-sm font-medium">
            {item.locationCount} locations
          </Text>
        </View>
        {item.category && (
          <View className="bg-gray-100 px-3 py-1 rounded-full ml-2">
            <Text className="text-gray-600 text-sm">{item.category}</Text>
          </View>
        )}
      </View>

      {item.tags.length > 0 && (
        <View className="flex-row flex-wrap mt-2">
          {item.tags.map((tag, index) => (
            <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-2">
              <Text className="text-gray-600 text-xs">{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-red-500 text-center mb-4">Failed to load boards</Text>
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
          <Text className="text-2xl font-bold text-[#2D2B3F]">Boards</Text>
          <TouchableOpacity
            onPress={() => router.push("/add-board")}
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
            <Text className="ml-2 text-gray-500">Search boards...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-12 h-12 bg-[#E5E1FF] rounded-full items-center justify-center"
            onPress={() => router.push("/filters")}
          >
            <Filter size={20} color="#6A62B7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Boards List */}
      <FlatList
        data={data?.data}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4"
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
              <Layout size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">No boards found</Text>
              <TouchableOpacity
                className="mt-4 bg-[#6A62B7] px-6 py-3 rounded-full"
                onPress={() => router.push("/add-board")}
              >
                <Text className="text-white font-medium">Create Board</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
} 