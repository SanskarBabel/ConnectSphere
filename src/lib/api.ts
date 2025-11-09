import { User } from "@/types/user";

// Configure your backend API URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  // Create a new user
  createUser: async (userData: Omit<User, "id" | "createdAt" | "friends">): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  // Update a user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }
  },

  // Add friendship (bidirectional)
  linkUsers: async (userId: string, friendId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    if (!response.ok) throw new Error("Failed to link users");
    return response.json();
  },

  // Remove friendship
  unlinkUsers: async (userId: string, friendId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/unlink`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    if (!response.ok) throw new Error("Failed to unlink users");
    return response.json();
  },

  // Add hobby to user
  addHobby: async (userId: string, hobby: string): Promise<User> => {
    const user = await fetch(`${API_BASE_URL}/users/${userId}`).then(r => r.json());
    const updatedHobbies = [...new Set([...user.hobbies, hobby])];
    return api.updateUser(userId, { hobbies: updatedHobbies });
  },

  // Get graph data
  getGraph: async (): Promise<{ nodes: any[]; edges: any[] }> => {
    const response = await fetch(`${API_BASE_URL}/graph`);
    if (!response.ok) throw new Error("Failed to fetch graph");
    return response.json();
  },
};
