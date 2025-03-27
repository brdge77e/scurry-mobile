import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView } from "react-native";
import { useAuth } from "../src/contexts/AuthContext";
import { Button } from "../src/components/ui/button";
import { Facebook, Mail } from "lucide-react-native";
import { useToast } from "../src/hooks/use-toast";
import { router } from "expo-router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleEmailLogin = () => {
    if (!email.trim() || !email.includes("@")) {
      toast({
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    login(email, "email");
  };

  const handleProviderLogin = (provider: string) => {
    // In a real app, you would integrate with OAuth providers
    // For now, we'll use a mock email
    const mockEmail = `user.${provider.toLowerCase()}@example.com`;
    login(mockEmail, provider);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E5E1FF]">
      <View className="flex-1 justify-center px-6 pt-8">
        <View className="items-center mb-10">
          <Text className="text-5xl font-black text-[#2D2B3F] mb-2">Inspired?</Text>
          <Text className="text-5xl font-black text-[#2D2B3F] mb-4">
            Let's add it to your
          </Text>
          <Text className="text-5xl font-black text-[#2D2B3F]">
            collection.
          </Text>
        </View>

        <View className="space-y-8">
          <Text className="text-center text-[#2D2B3F] font-medium text-lg">
            Don't have an account? Let's get started.
          </Text>

          <View className="space-y-4">
            <Button
              className="w-full h-14 rounded-lg flex-row items-center justify-center bg-[#4267B2]"
              onPress={() => handleProviderLogin("Facebook")}
              disabled={isLoading}
            >
              <Facebook className="h-5 w-5 text-white mr-3" />
              <Text className="text-white font-medium text-base">
                CONTINUE WITH FACEBOOK
              </Text>
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 rounded-lg flex-row items-center justify-center bg-white border border-gray-300"
              onPress={() => handleProviderLogin("Google")}
              disabled={isLoading}
            >
              <View className="mr-3">
                <Text className="text-gray-700 font-medium text-base">
                  CONTINUE WITH GOOGLE
                </Text>
              </View>
            </Button>
          </View>

          <View className="relative">
            <View className="absolute inset-0 items-center justify-center">
              <View className="w-full h-[1px] bg-gray-300" />
            </View>
            <View className="items-center">
              <Text className="px-2 bg-[#E5E1FF] text-[#2D2B3F]">or</Text>
            </View>
          </View>

          <View className="space-y-4">
            <TextInput
              className="h-12 rounded-lg bg-white shadow-sm border border-[#E5E1FF] px-4"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              className="w-full h-12 rounded-lg bg-[#6A62B7] flex-row items-center justify-center"
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-5 w-5 text-white" />
              <Text className="text-white font-medium">
                {isLoading ? "Signing in..." : "Continue with Email"}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
} 