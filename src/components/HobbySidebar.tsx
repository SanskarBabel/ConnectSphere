import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HobbySidebarProps {
  onHobbyDragStart: (hobby: string) => void;
}

const HobbySidebar: React.FC<HobbySidebarProps> = ({ onHobbyDragStart }) => {
  const { allHobbies } = useApp();
  const [search, setSearch] = useState("");
  const [newHobby, setNewHobby] = useState("");

  const filteredHobbies = allHobbies.filter(hobby =>
    hobby.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddHobby = () => {
    if (newHobby.trim()) {
      // In a real app, this would add to a global hobbies list
      toast({
        title: "Hobby ready",
        description: `Drag "${newHobby}" onto a user to add it`,
      });
      setNewHobby("");
    }
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-3">
          Hobbies ({allHobbies.length})
        </h2>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search hobbies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="New hobby..."
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddHobby()}
          />
          <Button size="icon" onClick={handleAddHobby}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {filteredHobbies.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hobbies found
            </p>
          ) : (
            filteredHobbies.map((hobby) => {
              const count = allHobbies.filter(h => h === hobby).length;
              return (
                <div
                  key={hobby}
                  draggable
                  onDragStart={() => onHobbyDragStart(hobby)}
                  className="cursor-move hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-normal">
                      {hobby}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {count} {count === 1 ? "user" : "users"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          💡 Drag hobbies onto user nodes to add them
        </p>
      </div>
    </div>
  );
};

export default HobbySidebar;
