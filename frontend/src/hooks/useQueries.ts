import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Location, Board, User, SearchParams } from "../types";

// Query keys
export const queryKeys = {
  locations: (params?: SearchParams) => ["locations", params] as const,
  location: (id: string) => ["locations", id] as const,
  boards: (params?: SearchParams) => ["boards", params] as const,
  board: (id: string) => ["boards", id] as const,
  user: ["user"] as const,
};

// Auth mutations
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name?: string }) =>
      api.register(email, password, name),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => api.verifyEmail(token),
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => api.requestPasswordReset(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      api.resetPassword(token, password),
  });
};

export const useSocialAuth = () => {
  return useMutation({
    mutationFn: ({ provider, token }: { provider: string; token: string }) =>
      api.socialAuth(provider, token),
  });
};

// Location queries
export const useLocations = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.locations(params),
    queryFn: () => api.getLocations(params),
  });
};

export const useLocation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.location(id),
    queryFn: () => api.getLocation(id),
    enabled: !!id,
  });
};

// Location mutations
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Location, "id" | "createdAt" | "updatedAt">) =>
      api.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations() });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Location> }) =>
      api.updateLocation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.location(id) });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteLocation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.location(id) });
    },
  });
};

export const useToggleLocationFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.toggleLocationFavorite(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.location(id) });
    },
  });
};

export const useShareLocation = () => {
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      api.shareLocation(id, email),
  });
};

// Board queries
export const useBoards = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.boards(params),
    queryFn: () => api.getBoards(params),
  });
};

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: queryKeys.board(id),
    queryFn: () => api.getBoard(id),
    enabled: !!id,
  });
};

// Board mutations
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Board, "id" | "createdAt" | "updatedAt">) =>
      api.createBoard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards() });
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Board> }) =>
      api.updateBoard(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards() });
      queryClient.invalidateQueries({ queryKey: queryKeys.board(id) });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteBoard(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boards() });
      queryClient.invalidateQueries({ queryKey: queryKeys.board(id) });
    },
  });
};

export const useShareBoard = () => {
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      api.shareBoard(id, email),
  });
};

export const useAddCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      api.addCollaborator(id, email),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board(id) });
    },
  });
};

export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      api.removeCollaborator(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.board(id) });
    },
  });
};

// User mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: FormData) => api.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}; 