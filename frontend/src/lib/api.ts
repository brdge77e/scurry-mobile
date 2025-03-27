import { 
  ApiResponse, 
  Location, 
  Board, 
  User, 
  SearchParams, 
  PaginatedResponse,
  AuthResponse,
  EmailVerificationResponse,
  PasswordResetResponse,
  SocialAuthResponse
} from "../types";

const API_URL = "https://api.scurry.com"; // Replace with your actual API URL

class ApiClient {
  private token?: string;

  setToken(token: string) {
    this.token = token;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.fetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    return this.fetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async verifyEmail(token: string): Promise<EmailVerificationResponse> {
    return this.fetch<EmailVerificationResponse>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    return this.fetch<PasswordResetResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<PasswordResetResponse> {
    return this.fetch<PasswordResetResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  async socialAuth(provider: string, token: string): Promise<SocialAuthResponse> {
    return this.fetch<SocialAuthResponse>("/auth/social", {
      method: "POST",
      body: JSON.stringify({ provider, token }),
    });
  }

  // Locations
  async getLocations(params?: SearchParams): Promise<PaginatedResponse<Location[]>> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return this.fetch<Location[]>(`/locations?${queryString}`);
  }

  async getLocation(id: string): Promise<ApiResponse<Location>> {
    return this.fetch<Location>(`/locations/${id}`);
  }

  async createLocation(data: Omit<Location, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Location>> {
    return this.fetch<Location>("/locations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLocation(id: string, data: Partial<Location>): Promise<ApiResponse<Location>> {
    return this.fetch<Location>(`/locations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLocation(id: string): Promise<ApiResponse<void>> {
    return this.fetch<void>(`/locations/${id}`, {
      method: "DELETE",
    });
  }

  async toggleLocationFavorite(id: string): Promise<ApiResponse<Location>> {
    return this.fetch<Location>(`/locations/${id}/favorite`, {
      method: "POST",
    });
  }

  async shareLocation(id: string, email: string): Promise<ApiResponse<void>> {
    return this.fetch<void>(`/locations/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Boards
  async getBoards(params?: SearchParams): Promise<PaginatedResponse<Board[]>> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return this.fetch<Board[]>(`/boards?${queryString}`);
  }

  async getBoard(id: string): Promise<ApiResponse<Board>> {
    return this.fetch<Board>(`/boards/${id}`);
  }

  async createBoard(data: Omit<Board, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Board>> {
    return this.fetch<Board>("/boards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<ApiResponse<Board>> {
    return this.fetch<Board>(`/boards/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string): Promise<ApiResponse<void>> {
    return this.fetch<void>(`/boards/${id}`, {
      method: "DELETE",
    });
  }

  async shareBoard(id: string, email: string): Promise<ApiResponse<void>> {
    return this.fetch<void>(`/boards/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async addCollaborator(id: string, email: string): Promise<ApiResponse<Board>> {
    return this.fetch<Board>(`/boards/${id}/collaborators`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async removeCollaborator(id: string, userId: string): Promise<ApiResponse<Board>> {
    return this.fetch<Board>(`/boards/${id}/collaborators/${userId}`, {
      method: "DELETE",
    });
  }

  // User
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.fetch<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async uploadAvatar(file: FormData): Promise<ApiResponse<{ url: string }>> {
    return this.fetch<{ url: string }>("/user/avatar", {
      method: "POST",
      body: file,
    });
  }
}

export const api = new ApiClient(); 