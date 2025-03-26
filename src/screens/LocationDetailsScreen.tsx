import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Location } from '../types/index';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { MapPin, Star, Globe, Clock, DollarSign, Link as LinkIcon, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LocationDetailsRouteProp = RouteProp<RootStackParamList, 'LocationDetails'>;
type LocationDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock Google API data
interface GooglePlaceDetails {
  opening_hours?: {
    weekday_text: string[];
    open_now?: boolean;
  };
  price_level?: number;
  rating: number;
  website?: string;
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }[];
}

export function LocationDetailsScreen() {
  const navigation = useNavigation<LocationDetailsNavigationProp>();
  const route = useRoute<LocationDetailsRouteProp>();
  const [placeDetails, setPlaceDetails] = useState<GooglePlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const locationId = route.params?.locationId;

  // API Integration Comments:
  // This screen shows detailed information about a location
  // The implementation should include these API calls:
  //
  // 1. Fetching the location details from your backend:
  // useEffect(() => {
  //   const fetchLocationDetails = async () => {
  //     try {
  //       setLoading(true);
  //       // Fetch location details from your API
  //       const response = await api.getLocationById(locationId);
  //       setLocation(response.data);
  //
  //       // Optionally fetch additional details from third-party APIs (Google Places, etc.)
  //       if (response.data.placeId) {
  //         const placeResponse = await api.getGooglePlaceDetails(response.data.placeId);
  //         setPlaceDetails(placeResponse.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching location details:', error);
  //       // Display error state
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchLocationDetails();
  // }, [locationId]);
  //
  // 2. Toggling favorite status:
  // const toggleFavorite = async () => {
  //   try {
  //     if (!location) return;
  //     
  //     const updatedFavoriteStatus = !location.isFavorite;
  //     // Update in your API
  //     await api.updateLocationFavoriteStatus(location.id, updatedFavoriteStatus);
  //     
  //     // Update local state
  //     setLocation(prev => prev ? {...prev, isFavorite: updatedFavoriteStatus} : null);
  //   } catch (error) {
  //     console.error('Error updating favorite status:', error);
  //     // Display error toast
  //   }
  // };
  //
  // 3. Adding location to board:
  // const addToBoard = async (boardId) => {
  //   try {
  //     if (!location) return;
  //     
  //     await api.addLocationToBoard(boardId, location.id);
  //     // Display success toast
  //     showToast('Location added to board!');
  //   } catch (error) {
  //     console.error('Error adding location to board:', error);
  //     // Display error toast
  //   }
  // };

  // Mock location data
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch the location from API or local storage
        // Mock data for demonstration
        const mockLocation: Location = {
          id: locationId || '2',
          name: 'Times Square',
          location: 'New York, NY',
          imageSrc: 'https://example.com/timessquare.jpg',
          category: 'Landmark',
          isFavorite: false,
          tags: ['landmark', 'tourism', 'entertainment'],
          notes: ['Famous commercial intersection and tourist destination'],
        };
        
        setLocation(mockLocation);
        
        // Mock API call to Google Places API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock Google Places data
        const mockGoogleData: GooglePlaceDetails = {
          opening_hours: {
            weekday_text: [
              'Monday: 24 hours',
              'Tuesday: 24 hours',
              'Wednesday: 24 hours',
              'Thursday: 24 hours',
              'Friday: 24 hours',
              'Saturday: 24 hours',
              'Sunday: 24 hours',
            ],
            open_now: true,
          },
          price_level: 2,
          rating: 4.5,
          website: 'https://www.timessquarenyc.org',
          reviews: [
            {
              author_name: 'John Smith',
              rating: 5,
              text: 'Amazing place! So much energy and things to see.',
              time: 1615425600,
            },
            {
              author_name: 'Jane Doe',
              rating: 4,
              text: 'Bustling and vibrant, but very crowded.',
              time: 1620425600,
            },
            {
              author_name: 'Michael Johnson',
              rating: 5,
              text: 'The heart of NYC. Must visit at night to see all the lights!',
              time: 1625425600,
            },
            {
              author_name: 'Sarah Williams',
              rating: 3,
              text: 'Too crowded for my taste, but the energy is undeniable.',
              time: 1630425600,
            },
            {
              author_name: 'David Brown',
              rating: 4,
              text: 'Iconic location. Great for people watching.',
              time: 1635425600,
            },
            {
              author_name: 'Emma Wilson',
              rating: 5,
              text: 'Loved the atmosphere! So many shops and restaurants nearby.',
              time: 1640425600,
            },
            {
              author_name: 'Robert Taylor',
              rating: 4,
              text: 'A must-see when in New York. Very lively day and night.',
              time: 1645425600,
            },
            {
              author_name: 'Olivia Martinez',
              rating: 5,
              text: 'The billboards are amazing. Great photo opportunities.',
              time: 1650425600,
            },
            {
              author_name: 'James Anderson',
              rating: 3,
              text: 'Interesting place but very touristy.',
              time: 1655425600,
            },
            {
              author_name: 'Sophia Garcia',
              rating: 4,
              text: 'Iconic location with great energy. Went twice during my stay.',
              time: 1660425600,
            },
          ],
        };
        
        setPlaceDetails(mockGoogleData);
      } catch (error) {
        console.error('Error fetching location details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [locationId]);

  const handleOpenMaps = () => {
    if (!location) return;
    
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location.location
    )}`;
    Linking.openURL(url);
  };

  const handleOpenWebsite = () => {
    if (placeDetails?.website) {
      Linking.openURL(placeDetails.website);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const renderPriceLevel = (priceLevel?: number) => {
    if (priceLevel === undefined) return 'Not available';
    
    const dollars = [];
    for (let i = 0; i < priceLevel; i++) {
      dollars.push('$');
    }
    return dollars.join('');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />);
      } else {
        stars.push(<Star key={i} size={16} color="#E5E7EB" />);
      }
    }
    
    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#6A62B7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A62B7" />
        </View>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#6A62B7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Location Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Location not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#6A62B7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{location.name}</Text>
      </View>
      
      <ScrollView>
        {location.imageSrc ? (
          <Image
            source={{ uri: location.imageSrc }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.image}>
            <PlaceholderImage size={48} color="#6B7280" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name}>{location.name}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Star size={20} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.detailText}>
                {placeDetails?.rating ? `${placeDetails.rating} rating` : 'No rating available'}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.detailRow} onPress={handleOpenMaps}>
              <MapPin size={20} color="#6A62B7" />
              <Text style={styles.detailText}>{location.location}</Text>
            </TouchableOpacity>
            
            {location.category && (
              <View style={styles.detailRow}>
                <Globe size={20} color="#6A62B7" />
                <Text style={styles.detailText}>{location.category}</Text>
              </View>
            )}
            
            {placeDetails?.opening_hours && (
              <View style={styles.detailRow}>
                <Clock size={20} color="#6A62B7" />
                <View style={styles.hoursContainer}>
                  <Text style={styles.detailText}>
                    {placeDetails.opening_hours.open_now ? 'Open now' : 'Closed now'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.location)}`)}
                  >
                    <Text style={styles.viewHoursText}>View hours</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {placeDetails?.price_level !== undefined && (
              <View style={styles.detailRow}>
                <DollarSign size={20} color="#6A62B7" />
                <Text style={styles.detailText}>
                  {renderPriceLevel(placeDetails.price_level)} · Price level
                </Text>
              </View>
            )}
            
            {placeDetails?.website && (
              <TouchableOpacity style={styles.detailRow} onPress={handleOpenWebsite}>
                <LinkIcon size={20} color="#6A62B7" />
                <Text style={[styles.detailText, styles.linkText]}>Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {location.notes && location.notes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              {location.notes.map((note, index) => (
                <Text key={index} style={styles.note}>
                  • {note}
                </Text>
              ))}
            </View>
          )}

          {location.tags && location.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {location.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {placeDetails?.reviews && placeDetails.reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {placeDetails.reviews
                .slice(0, showAllReviews ? placeDetails.reviews.length : 3)
                .map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                      <Text style={styles.reviewDate}>{formatDate(review.time)}</Text>
                    </View>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewText}>{review.text}</Text>
                  </View>
                ))}
              
              {placeDetails.reviews.length > 3 && !showAllReviews && (
                <TouchableOpacity 
                  style={styles.showMoreButton}
                  onPress={() => setShowAllReviews(true)}
                >
                  <Text style={styles.showMoreText}>Show more reviews</Text>
                  <ChevronRight size={16} color="#6A62B7" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2B3F',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2B3F',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  linkText: {
    color: '#6A62B7',
    textDecorationLine: 'underline',
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 12,
  },
  viewHoursText: {
    color: '#6A62B7',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2B3F',
    marginBottom: 12,
  },
  note: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E5E1FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#6A62B7',
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2B3F',
  },
  reviewDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  reviewText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A62B7',
    marginRight: 4,
  },
}); 