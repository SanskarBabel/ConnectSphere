import React from "react";
import { Handle, Position } from "reactflow";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy } from "lucide-react";

interface UserNodeProps {
  data: {
    label: string;
    user: User;
    score: number;
    isPopular: boolean;
  };
}

const UserNode: React.FC<UserNodeProps> = ({ data }) => {
  const { user, score, isPopular } = data;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-lg transition-all duration-300 min-w-[180px] ${
        isPopular
          ? "bg-card border-accent shadow-accent/20 scale-110"
          : "bg-card border-primary shadow-primary/20"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isPopular ? "bg-accent" : "bg-primary"
            }`}
          />
          <span className="font-semibold text-card-foreground text-sm">
            {user.username}
          </span>
          {isPopular && <Trophy className="w-4 h-4 text-accent" />}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Age: {user.age}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{user.friends.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {user.hobbies.slice(0, 2).map((hobby) => (
            <Badge key={hobby} variant="secondary" className="text-xs">
              {hobby}
            </Badge>
          ))}
          {user.hobbies.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{user.hobbies.length - 2}
            </Badge>
          )}
        </div>

        <div className="pt-1 border-t border-border">
          <span className="text-xs font-medium text-primary">
            Score: {score.toFixed(1)}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
};

export default UserNode;
