import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Search } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';
import { BoardEditModal } from '../components/BoardEditModal';

type AllBoardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllBoards'>;

interface Board {
  id: string;
  name: string;
  coverImage?: string;
  locationCount: number;
}

export function AllBoardsScreen() {
  const navigation = useNavigation<AllBoardsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Mock data - replace with actual data from your state management system
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      name: 'Japan Grad Trip! 👘',
      locationCount: 12,
    },
    {
      id: '2',
      name: 'Europe Summer 2024 🌞',
      locationCount: 8,
    },
    // Add more boards as needed
  ]);

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBoard = (data: { name: string; coverImage?: string }) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name: data.name,
      coverImage: data.coverImage,
      locationCount: 0,
    };
    setBoards(prev => [newBoard, ...prev]);
    setIsCreateModalVisible(false);
  };

  const renderBoardItem = ({ item }: { item: Board }) => (
    <TouchableOpacity
      style={styles.boardItem}
      onPress={() => navigation.navigate('Board', { boardId: item.id })}
    >
      <View>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.locationCount}>
          {item.locationCount} {item.locationCount === 1 ? 'location' : 'locations'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Boards</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Plus size={24} color="#6A62B7" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search boards"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
      </View>

      <FlatList
        data={filteredBoards}
        renderItem={renderBoardItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <BoardEditModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSave={handleCreateBoard}
        mode="create"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2D2B3F',
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#2D2B3F',
  },
  listContent: {
    padding: 16,
  },
  boardItem: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 12,
  },
  boardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2B3F',
    marginBottom: 4,
  },
  locationCount: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 