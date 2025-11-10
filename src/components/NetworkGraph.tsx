import React, { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MiniMap,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { useApp } from "@/contexts/AppContext";
import UserNode from "./UserNode";
import { User } from "@/types/user";

interface NetworkGraphProps {
  onUserDrop?: (userId: string) => void;
}

const nodeTypes = {
  userNode: UserNode,
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ onUserDrop }) => {
  const { users, linkUsers, getPopularityScore } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate graph layout
  useEffect(() => {
    const graphNodes: Node[] = users.map((user, index) => {
      const angle = (2 * Math.PI * index) / users.length;
      const radius = 250;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      const score = getPopularityScore(user.id);
      const isPopular = score > 5;

      return {
        id: user.id,
        type: "userNode",
        position: { x, y },
        data: {
          label: user.username,
          user,
          score,
          isPopular,
          onDrop: onUserDrop,
        },
      };
    });

    const graphEdges: Edge[] = [];
    users.forEach(user => {
      user.friends.forEach(friendId => {
        // Add edge only once (avoid duplicates)
        if (user.id < friendId) {
          graphEdges.push({
            id: `${user.id}-${friendId}`,
            source: user.id,
            target: friendId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
          });
        }
      });
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [users, getPopularityScore, setNodes, setEdges, onUserDrop]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        linkUsers(connection.source, connection.target);
      }
    },
    [linkUsers]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const score = node.data.score || 0;
            return score > 5 ? "hsl(var(--node-popular))" : "hsl(var(--node-regular))";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export default NetworkGraph;