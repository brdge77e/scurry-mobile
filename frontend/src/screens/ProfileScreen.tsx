import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { Edit2, LogOut, HelpCircle, MessageCircle, User } from 'lucide-react-native';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to update your profile picture.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        
        // API Integration Comment:
        // In a real app, you would upload the image to your server:
        // try {
        //   const formData = new FormData();
        //   formData.append('profileImage', {
        //     uri: result.assets[0].uri,
        //     type: 'image/jpeg',
        //     name: 'profile-image.jpg',
        //   });
        //   await api.updateProfileImage(formData);
        // } catch (error) {
        //   console.error('Error uploading profile image:', error);
        //   Alert.alert('Upload Error', 'Failed to upload profile image. Please try again.');
        // }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleAboutUs = () => {
    // Navigate to About Us page or show modal
    Alert.alert('About Us', 'This is a travel app that helps you organize your favorite locations.');
  };

  const handleSupport = () => {
    // Navigate to Support page or show modal
    Alert.alert('Support', 'Need help? Contact us at support@scurry.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editImageButton}
              onPress={handlePickImage}
            >
              <Edit2 size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <User size={24} color="#6A62B7" />
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleAboutUs}>
            <HelpCircle size={24} color="#6A62B7" />
            <Text style={styles.menuText}>About Us</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
            <MessageCircle size={24} color="#6A62B7" />
            <Text style={styles.menuText}>Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D2B3F',
    textAlign: 'center',
    marginBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImageWrapper: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E5E1FF',
    overflow: 'visible',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E5E1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#6A62B7',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#374151',
  },
}); 