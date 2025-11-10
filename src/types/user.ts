export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[]; // Array of user IDs
  createdAt: Date;
  popularityScore?: number;
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    user: User;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
