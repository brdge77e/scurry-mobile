import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Location } from '../../types/index';
import { useToast } from '../../hooks/use-toast';
import { Heart, MapPin, Star, Phone, Globe, Clock, AlertCircle } from 'lucide-react-native';
import { format } from 'date-fns';

interface LocationDetailsDialogProps {
  location: Location | null;
  visible: boolean;
  onClose: () => void;
  onSave: (location: Location) => Promise<void>;
  onDelete: (locationId: string) => Promise<void>;
  onToggleFavorite: (locationId: string) => Promise<void>;
  isLoading?: boolean;
}

interface GooglePlaceDetails {
  openingHours?: {
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
    weekdayText: string[];
  };
  website?: string;
  phoneNumber?: string;
  priceLevel?: number;
  rating?: number;
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    time: string;
  }>;
}

export function LocationDetailsDialog({
  location,
  visible,
  onClose,
  onSave,
  onDelete,
  onToggleFavorite,
  isLoading = false,
}: LocationDetailsDialogProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState<Location | null>(null);
  const [placeDetails, setPlaceDetails] = useState<GooglePlaceDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location) {
      setEditedLocation(location);
      setIsEditing(false);
      setImageError(false);
      fetchPlaceDetails();
    }
  }, [location]);

  const fetchPlaceDetails = async () => {
    setIsLoadingDetails(true);
    try {
      // In a real app, this would call your backend API which would then call Google Places API
      // For now, we'll use mock data
      const mockDetails: GooglePlaceDetails = {
        openingHours: {
          periods: [
            { open: { day: 1, time: "0900" }, close: { day: 1, time: "1700" } },
            { open: { day: 2, time: "0900" }, close: { day: 2, time: "1700" } },
          ],
          weekdayText: [
            "Monday: 9:00 AM – 5:00 PM",
            "Tuesday: 9:00 AM – 5:00 PM",
            "Wednesday: 9:00 AM – 5:00 PM",
            "Thursday: 9:00 AM – 5:00 PM",
            "Friday: 9:00 AM – 5:00 PM",
            "Saturday: Closed",
            "Sunday: Closed"
          ]
        },
        website: "https://example.com",
        phoneNumber: "+1234567890",
        priceLevel: 2,
        rating: 4.5,
        reviews: [
          {
            author: "John Doe",
            rating: 5,
            text: "Great place!",
            time: "2024-03-15"
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlaceDetails(mockDetails);
    } catch (error) {
      console.error("Failed to fetch place details:", error);
      toast({
        title: "Error",
        description: "Failed to load location details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSave = async () => {
    if (!editedLocation) return;
    setIsSubmitting(true);
    try {
      await onSave(editedLocation);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!location) return;
    setIsSubmitting(true);
    try {
      await onDelete(location.id);
      onClose();
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!location) return;
    setIsSubmitting(true);
    try {
      await onToggleFavorite(location.id);
      toast({
        title: location.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!location) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            {!imageError ? (
              <Image
                source={{ uri: location.imageSrc }}
                style={styles.heroImage}
                onError={handleImageError}
              />
            ) : (
              <View style={styles.imageErrorContainer}>
                <AlertCircle size={48} color="#6B7280" />
                <Text style={styles.imageErrorText}>Failed to load image</Text>
              </View>
            )}
            <View style={styles.heroOverlay}>
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <View style={styles.heroContent}>
                <Text style={styles.locationName}>{location.name}</Text>
                <View style={styles.locationInfo}>
                  <MapPin size={16} color="#FFFFFF" />
                  <Text style={styles.locationAddress}>{location.location}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>
                    {placeDetails?.rating?.toFixed(1) || 'N/A'} 
                    ({placeDetails?.reviews?.length || 0} reviews)
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={handleToggleFavorite}
                  disabled={isSubmitting}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Heart
                    size={24}
                    color="#FFFFFF"
                    fill={location.isFavorite ? "#FFFFFF" : "none"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading location details...</Text>
              </View>
            ) : (
              <>
                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.description}>
                    {location.description || 'No description available.'}
                  </Text>
                </View>

                {/* Opening Hours */}
                {!isLoadingDetails && placeDetails?.openingHours && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Clock size={20} color="#374151" />
                      <Text style={styles.sectionTitle}>Opening Hours</Text>
                    </View>
                    {placeDetails.openingHours.weekdayText.map((day, index) => (
                      <Text key={index} style={styles.openingHoursText}>
                        {day}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Contact Info */}
                {!isLoadingDetails && placeDetails && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    {placeDetails.website && (
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL(placeDetails.website!)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Globe size={20} color="#3B82F6" />
                        <Text style={styles.contactText}>Visit Website</Text>
                      </TouchableOpacity>
                    )}
                    {placeDetails.phoneNumber && (
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => Linking.openURL(`tel:${placeDetails.phoneNumber}`)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Phone size={20} color="#3B82F6" />
                        <Text style={styles.contactText}>{placeDetails.phoneNumber}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Reviews */}
                {!isLoadingDetails && placeDetails?.reviews && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    {placeDetails.reviews.map((review, index) => (
                      <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.reviewAuthor}>{review.author}</Text>
                          <View style={styles.reviewRating}>
                            <Star size={16} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.reviewRatingText}>{review.rating}</Text>
                          </View>
                        </View>
                        <Text style={styles.reviewText}>{review.text}</Text>
                        <Text style={styles.reviewTime}>
                          {format(new Date(review.time), 'MMM d, yyyy')}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actions}>
                  {isEditing ? (
                    <>
                      <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSave}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.buttonText}>Save</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => setIsEditing(false)}
                        disabled={isSubmitting}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => setIsEditing(true)}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.buttonText}>Delete</Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  heroContainer: {
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  openingHoursText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#3B82F6',
    marginLeft: 8,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  reviewTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    opacity: 1,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  imageErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  imageErrorText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 