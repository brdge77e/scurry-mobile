import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Search } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';
import { BoardEditModal } from '../components/BoardEditModal';
import { PlaceholderImage } from '../components/PlaceholderImage';

type AllBoardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllBoards'>;

interface Board {
  id: string;
  name: string;
  coverImage?: string;
  locationCount: number;
}

export function AllBoardsScreen() {
  const navigation = useNavigation<AllBoardsScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Mock data - replace with actual data from your state management system
  const [boards, setBoards] = useState<Board[]>([
    {
      id: '1',
      name: 'Japan Grad Trip! 👘',
      coverImage: 'https://example.com/japan.jpg',
      locationCount: 12,
    },
    {
      id: '2',
      name: 'Europe Summer 2024 🌞',
      coverImage: 'https://example.com/europe.jpg',
      locationCount: 8,
    },
    {
      id: '3',
      name: 'Hangouts~~',
      coverImage: 'https://example.com/hangouts.jpg',
      locationCount: 7,
    },
    // Add more boards as needed
  ]);

  // Load boards when screen comes into focus to reflect changes from other screens
  useEffect(() => {
    if (isFocused) {
      // This is where you would fetch updated board data when returning to this screen
      
      // API Integration point:
      // When implementing backend, replace this with a fresh API call to get latest board data
      // const fetchBoards = async () => {
      //   try {
      //     const response = await api.getBoards();
      //     setBoards(response.data);
      //   } catch (error) {
      //     console.error('Error fetching boards:', error);
      //   }
      // };
      // 
      // fetchBoards();

      // For now, we're just using mock data, but this effect will run when returning from BoardScreen
      console.log('AllBoardsScreen focused - should refresh data');
    }
  }, [isFocused]);

  // API Integration Comment:
  // When implementing the backend integration, replace the mock data and functions with:
  // 1. useEffect to fetch the boards data from your API endpoint
  // useEffect(() => {
  //   const fetchBoards = async () => {
  //     try {
  //       const response = await api.getBoards();
  //       setBoards(response.data);
  //     } catch (error) {
  //       console.error('Error fetching boards:', error);
  //     }
  //   };
  // 
  //   fetchBoards();
  // }, []);
  //
  // 2. Update handleCreateBoard to call your API
  // const handleCreateBoard = async (data) => {
  //   try {
  //     const response = await api.createBoard(data);
  //     setBoards(prev => [response.data, ...prev]);
  //     setIsCreateModalVisible(false);
  //   } catch (error) {
  //     console.error('Error creating board:', error);
  //   }
  // };
  //
  // 3. Implement a function to keep board data in sync with your backend
  // When navigating back from BoardScreen, you should fetch the updated data
  // You can use the useIsFocused hook to trigger a refresh when this screen is focused

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBoard = (data: { name: string; coverImage?: string }) => {
    // API Integration point: Replace with API call to create a board
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
      <View style={styles.boardImageContainer}>
        {item.coverImage ? (
          <Image
            source={{ uri: item.coverImage }}
            style={styles.boardImage}
            onError={() => {
              // Handle image loading errors
              console.log(`Failed to load image for board: ${item.name}`);
            }}
          />
        ) : (
          <View style={styles.boardPlaceholder}>
            <PlaceholderImage size={24} />
          </View>
        )}
      </View>
      <View style={styles.boardContent}>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  boardImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  boardPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  boardContent: {
    flex: 1,
    padding: 16,
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