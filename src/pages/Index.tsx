import React, { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import NetworkGraph from "@/components/NetworkGraph";
import HobbySidebar from "@/components/HobbySidebar";
import UserPanel from "@/components/UserPanel";
import { Button } from "@/components/ui/button";
import { Network, Users, Heart } from "lucide-react";

const IndexContent: React.FC = () => {
  const { addHobbyToUser } = useApp();
  const [draggedHobby, setDraggedHobby] = useState<string | null>(null);

  const handleHobbyDragStart = (hobby: string) => {
    setDraggedHobby(hobby);
  };

  const handleDrop = (userId: string) => {
    if (draggedHobby) {
      addHobbyToUser(userId, draggedHobby);
      setDraggedHobby(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Network className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Hobby Network
              </h1>
              <p className="text-xs text-muted-foreground">
                Interactive User Relationship Graph
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-node-popular" />
                <span className="text-muted-foreground">Score &gt; 5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-node-regular" />
                <span className="text-muted-foreground">Score ≤ 5</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Hobby Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <HobbySidebar onHobbyDragStart={handleHobbyDragStart} />
        </aside>

        {/* Graph */}
        <main className="flex-1 relative">
          <NetworkGraph onUserDrop={handleDrop} />
          <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              Quick Tips
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Drag to connect users as friends</li>
              <li>• Drag hobbies onto users to add</li>
              <li>• Zoom and pan to explore</li>
              <li>• Green nodes = Popular (score &gt; 5)</li>
            </ul>
          </div>
        </main>

        {/* User Panel */}
        <aside className="w-80 flex-shrink-0">
          <UserPanel />
        </aside>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

export default Index;
