import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Search } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';
import { BoardEditModal } from '../components/BoardEditModal';
import supabase from '../utils/supabaseClient';

type AllBoardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllBoards'>;

interface Board {
  id: string;
  name: string;
  // coverImage?: string;
  locationCount: number;
}

export function AllBoardsScreen() {
  const navigation = useNavigation<AllBoardsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('boards')
      .select(`
        id,
        name,
        board_location:board_location (location_id)
      `);
  
    if (error) {
      console.error('Error fetching boards:', error);
    } else {
      const boardsWithCount = data.map(board => ({
        id: board.id,
        name: board.name,
        locationCount: board.board_location?.length || 0,
      }));
      setBoards(boardsWithCount);
    }
  
    setLoading(false);
  };

  const handleCreateBoard = async (data: { name: string; coverImage?: string }) => {
    const { error, data: newBoard } = await supabase
      .from('boards')
      .insert([
        {
          name: data.name,
          user: '952e86e8-9e5a-4d88-9a74-da0bc88ae728',
          // coverImage: data.coverImage || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating board:', error);
    } else {
      setBoards(prev => [newBoard as Board, ...prev]);
    }

    setIsCreateModalVisible(false);
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} size="large" color="#6A62B7" />
      ) : (
        <FlatList
          data={filteredBoards}
          renderItem={renderBoardItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

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