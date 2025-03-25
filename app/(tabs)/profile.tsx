import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useUpdateProfile, useUploadAvatar } from "../../src/hooks/useQueries";
import { useToast } from "../../src/components/Toast";
import {
  Settings,
  LogOut,
  User,
  Bell,
  Lock,
  HelpCircle,
  ChevronRight,
  Camera,
  Edit2,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const MENU_ITEMS = [
  {
    icon: User,
    label: "Account Settings",
    onPress: () => {},
  },
  {
    icon: Bell,
    label: "Notifications",
    onPress: () => {},
  },
  {
    icon: Lock,
    label: "Privacy",
    onPress: () => {},
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    onPress: () => {},
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("avatar", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "avatar.jpg",
        } as any);

        await uploadAvatar.mutateAsync(formData);
        toast.show("Profile picture updated successfully");
      }
    } catch (error) {
      toast.show("Failed to update profile picture", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async (name: string) => {
    try {
      await updateProfile.mutateAsync({ name });
      toast.show("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.show("Failed to update profile", "error");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-[#2D2B3F]">Profile</Text>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              className="w-10 h-10 rounded-full bg-[#E5E1FF] items-center justify-center"
            >
              <Settings size={20} color="#6A62B7" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View className="items-center py-8">
            <View className="relative">
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-[#E5E1FF] items-center justify-center">
                  <Text className="text-3xl font-bold text-[#6A62B7]">
                    {user?.name?.[0] || "U"}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleImagePick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#6A62B7] rounded-full items-center justify-center"
              >
                {isUploading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Camera size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center mt-4">
              {isEditing ? (
                <TextInput
                  className="text-xl font-semibold text-[#2D2B3F] text-center"
                  value={user?.name || ""}
                  onChangeText={(text) => handleUpdateProfile(text)}
                  autoFocus
                />
              ) : (
                <>
                  <Text className="text-xl font-semibold text-[#2D2B3F]">
                    {user?.name || "User"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    className="ml-2"
                  >
                    <Edit2 size={16} color="#6A62B7" />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <Text className="text-gray-500 mt-1">{user?.email}</Text>
            {!user?.isEmailVerified && (
              <TouchableOpacity
                className="mt-2 bg-yellow-50 px-3 py-1 rounded-full"
                onPress={() => router.push("/verify-email")}
              >
                <Text className="text-yellow-600 text-sm">Verify Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4 border-b border-gray-100"
              onPress={item.onPress}
            >
              <View className="w-8 h-8 rounded-full bg-[#E5E1FF] items-center justify-center mr-4">
                <item.icon size={20} color="#6A62B7" />
              </View>
              <Text className="flex-1 text-[#2D2B3F] font-medium">
                {item.label}
              </Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="mx-4 mt-8 mb-4 flex-row items-center justify-center bg-red-50 py-4 rounded-xl"
          onPress={logout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-500 font-medium ml-2">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 