export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  location: string;
  imageSrc?: string;
  category: string;
  isFavorite: boolean;
  tags?: string[];
  note: string | null;
  sourceLink?: string;
}

export interface LocationFilters {
  rating?: number;
  priceLevel?: number;
  isFavorite?: boolean;
  category?: string;
}

export interface LocationSearchState {
  searchQuery: string;
  filteredLocations: Location[];
  suggestions: string[];
  filters: LocationFilters;
  isLoading: boolean;
}

export interface LocationDetailsDialogProps {
  location: Location;
  visible: boolean;
  onClose: () => void;
  onSave: (location: Location) => Promise<void>;
  onDelete: (locationId: string) => Promise<void>;
  onToggleFavorite: (locationId: string) => Promise<void>;
  isLoading?: boolean;
}

export interface LocationSelectionListProps {
  locations: Location[];
  selectedLocationIds: string[];
  onToggleLocation: (locationId: string) => void;
  onViewDetails: (location: Location) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isLoading?: boolean;
}

export interface LocationSearchProps {
  locations: Location[];
  onSearch: (query: string) => void;
  onFilter: (filters: LocationFilters) => void;
  isLoading?: boolean;
}

export interface LocationSuggestionsProps {
  suggestions: string[];
  onSelectLocation: (location: string) => void;
  isLoading?: boolean;
}

export interface SelectedLocationsListProps {
  locations: Location[];
  selectedLocationIds: string[];
  onToggleLocation: (locationId: string) => void;
  onDeleteSelected: () => void;
  onShareSelected: () => void;
  onViewOnMap: () => void;
  isLoading?: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  image?: string;
  locationCount: number;
  category?: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  collaborators: string[];
  template?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface SearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface SocialAuthResponse extends AuthResponse {
  provider: string;
}

export interface RouteParams {
  sourceLink?: string;
  selectedLocations?: Location[];
  id?: string;
}

export interface ToastProps {
  description: string;
  duration?: number;
} 