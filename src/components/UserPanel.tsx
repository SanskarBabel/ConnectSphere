import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Users, Trophy } from "lucide-react";
import { User } from "@/types/user";

const UserPanel: React.FC = () => {
  const { users, createUser, updateUser, deleteUser, getPopularityScore } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    hobbies: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hobbiesArray = formData.hobbies
      .split(",")
      .map(h => h.trim())
      .filter(h => h.length > 0);

    if (editingUser) {
      await updateUser(editingUser.id, {
        username: formData.username,
        age: parseInt(formData.age),
        hobbies: hobbiesArray,
      });
      setEditingUser(null);
    } else {
      await createUser({
        username: formData.username,
        age: parseInt(formData.age),
        hobbies: hobbiesArray,
      });
      setIsCreateOpen(false);
    }

    setFormData({ username: "", age: "", hobbies: "" });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      age: user.age.toString(),
      hobbies: user.hobbies.join(", "),
    });
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
      } catch (error) {
        // Error handled in context
      }
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const scoreA = getPopularityScore(a.id);
    const scoreB = getPopularityScore(b.id);
    return scoreB - scoreA;
  });

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Users ({users.length})
          </h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="150"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hobbies">Hobbies (comma-separated)</Label>
                  <Input
                    id="hobbies"
                    value={formData.hobbies}
                    onChange={(e) =>
                      setFormData({ ...formData, hobbies: e.target.value })
                    }
                    placeholder="reading, coding, gaming"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {sortedUsers.map((user) => {
            const score = getPopularityScore(user.id);
            const isPopular = score > 5;

            return (
              <Card
                key={user.id}
                className={`transition-all ${
                  isPopular ? "border-accent shadow-accent/10" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">
                        {user.username}
                      </CardTitle>
                      {isPopular && <Trophy className="w-4 h-4 text-accent" />}
                    </div>
                    <div className="flex gap-1">
                      <Dialog
                        open={editingUser?.id === user.id}
                        onOpenChange={(open) => !open && setEditingUser(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="edit-username">Username</Label>
                              <Input
                                id="edit-username"
                                value={formData.username}
                                onChange={(e) =>
                                  setFormData({ ...formData, username: e.target.value })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-age">Age</Label>
                              <Input
                                id="edit-age"
                                type="number"
                                min="1"
                                max="150"
                                value={formData.age}
                                onChange={(e) =>
                                  setFormData({ ...formData, age: e.target.value })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-hobbies">
                                Hobbies (comma-separated)
                              </Label>
                              <Input
                                id="edit-hobbies"
                                value={formData.hobbies}
                                onChange={(e) =>
                                  setFormData({ ...formData, hobbies: e.target.value })
                                }
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Update User
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Age: {user.age}</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{user.friends.length}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.hobbies.map((hobby) => (
                      <Badge key={hobby} variant="secondary" className="text-xs">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs font-medium text-primary">
                      Popularity: {score.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserPanel;
