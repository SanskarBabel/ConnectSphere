import { User } from "@/types/user";
import { v4 as uuidv4 } from "uuid";

// Mock data for demonstration (replace with real API calls)
export const generateMockUsers = (): User[] => {
  const users: User[] = [
    {
      id: uuidv4(),
      username: "alice_wonder",
      age: 28,
      hobbies: ["reading", "hiking", "photography"],
      friends: [],
      createdAt: new Date("2024-01-15"),
    },
    {
      id: uuidv4(),
      username: "bob_builder",
      age: 32,
      hobbies: ["coding", "gaming", "music"],
      friends: [],
      createdAt: new Date("2024-02-10"),
    },
    {
      id: uuidv4(),
      username: "carol_creative",
      age: 25,
      hobbies: ["painting", "reading", "yoga"],
      friends: [],
      createdAt: new Date("2024-03-05"),
    },
    {
      id: uuidv4(),
      username: "david_dev",
      age: 30,
      hobbies: ["coding", "hiking", "cooking"],
      friends: [],
      createdAt: new Date("2024-01-20"),
    },
    {
      id: uuidv4(),
      username: "emma_explorer",
      age: 27,
      hobbies: ["traveling", "photography", "yoga"],
      friends: [],
      createdAt: new Date("2024-02-28"),
    },
  ];

  // Create friendships
  users[0].friends = [users[1].id, users[2].id];
  users[1].friends = [users[0].id, users[3].id];
  users[2].friends = [users[0].id, users[4].id];
  users[3].friends = [users[1].id];
  users[4].friends = [users[2].id];

  return users;
};

export const calculatePopularityScore = (user: User, allUsers: User[]): number => {
  const friendCount = user.friends.length;
  
  let sharedHobbiesCount = 0;
  user.friends.forEach(friendId => {
    const friend = allUsers.find(u => u.id === friendId);
    if (friend) {
      const shared = user.hobbies.filter(h => friend.hobbies.includes(h)).length;
      sharedHobbiesCount += shared;
    }
  });

  return friendCount + (0.5 * sharedHobbiesCount);
};
