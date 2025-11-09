import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { generateMockUsers, calculatePopularityScore } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

interface AppContextType {
  users: User[];
  loading: boolean;
  createUser: (userData: Omit<User, "id" | "createdAt" | "friends">) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  linkUsers: (userId: string, friendId: string) => Promise<void>;
  unlinkUsers: (userId: string, friendId: string) => Promise<void>;
  addHobbyToUser: (userId: string, hobby: string) => Promise<void>;
  getPopularityScore: (userId: string) => number;
  allHobbies: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    // Replace this with: api.getUsers() when backend is ready
    const mockUsers = generateMockUsers();
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const createUser = async (userData: Omit<User, "id" | "createdAt" | "friends">) => {
    try {
      // Validate
      if (!userData.username || userData.age < 1 || userData.age > 150) {
        throw new Error("Invalid user data");
      }

      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        friends: [],
        createdAt: new Date(),
      };

      setUsers(prev => [...prev, newUser]);
      toast({ title: "Success", description: "User created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, ...userData } : u))
      );
      toast({ title: "Success", description: "User updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (user && user.friends.length > 0) {
        throw new Error("Cannot delete user with existing friends. Unlink friends first.");
      }

      setUsers(prev => prev.filter(u => u.id !== id));
      toast({ title: "Success", description: "User deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  const linkUsers = async (userId: string, friendId: string) => {
    try {
      if (userId === friendId) {
        throw new Error("Cannot link user to themselves");
      }

      const user = users.find(u => u.id === userId);
      const friend = users.find(u => u.id === friendId);

      if (!user || !friend) {
        throw new Error("User not found");
      }

      if (user.friends.includes(friendId)) {
        throw new Error("Users are already friends");
      }

      // Bidirectional friendship
      setUsers(prev =>
        prev.map(u => {
          if (u.id === userId) {
            return { ...u, friends: [...u.friends, friendId] };
          }
          if (u.id === friendId) {
            return { ...u, friends: [...u.friends, userId] };
          }
          return u;
        })
      );

      toast({ title: "Success", description: "Users linked successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  const unlinkUsers = async (userId: string, friendId: string) => {
    try {
      setUsers(prev =>
        prev.map(u => {
          if (u.id === userId) {
            return { ...u, friends: u.friends.filter(f => f !== friendId) };
          }
          if (u.id === friendId) {
            return { ...u, friends: u.friends.filter(f => f !== userId) };
          }
          return u;
        })
      );

      toast({ title: "Success", description: "Users unlinked successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to unlink users", variant: "destructive" });
      throw error;
    }
  };

  const addHobbyToUser = async (userId: string, hobby: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error("User not found");

      if (user.hobbies.includes(hobby)) {
        toast({ title: "Info", description: "User already has this hobby" });
        return;
      }

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, hobbies: [...u.hobbies, hobby] } : u
        )
      );

      toast({ title: "Success", description: `Added ${hobby} to ${user.username}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add hobby", variant: "destructive" });
      throw error;
    }
  };

  const getPopularityScore = (userId: string): number => {
    const user = users.find(u => u.id === userId);
    if (!user) return 0;
    return calculatePopularityScore(user, users);
  };

  const allHobbies = Array.from(new Set(users.flatMap(u => u.hobbies))).sort();

  return (
    <AppContext.Provider
      value={{
        users,
        loading,
        createUser,
        updateUser,
        deleteUser,
        linkUsers,
        unlinkUsers,
        addHobbyToUser,
        getPopularityScore,
        allHobbies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
