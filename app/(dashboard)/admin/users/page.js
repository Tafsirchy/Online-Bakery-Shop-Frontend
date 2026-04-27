'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  Trash2, 
  Loader2,
  Search,
  UserCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/auth/users');
      setUsers(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/auth/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await axios.delete(`/auth/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-sage text-white border-transparent shadow-sm';
      case 'manager': return 'bg-caramel text-white border-transparent shadow-sm';
      default: return 'text-muted border-border-light bg-cream-highlight';
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-brown font-bold">Community Management</h1>
            <p className="text-muted">Manage roles and permissions for your {users.length} members</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-border-light bg-white"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-cream-highlight/30 rounded-[2.5rem] border border-dashed border-border-light">
            <Loader2 className="w-8 h-8 text-sage animate-spin mb-4" />
            <p className="text-muted font-serif italic">Loading community members...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border-light shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-cream-highlight">
                <TableRow>
                  <TableHead className="font-bold text-brown">User</TableHead>
                  <TableHead className="font-bold text-brown">Email Address</TableHead>
                  <TableHead className="font-bold text-brown">Access Level</TableHead>
                  <TableHead className="font-bold text-brown">Joined On</TableHead>
                  <TableHead className="text-right font-bold text-brown">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-sage/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cream-highlight flex items-center justify-center border border-border-light shadow-inner">
                          <User className="w-5 h-5 text-brown/40" />
                        </div>
                        <span className="font-bold text-brown font-serif">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted text-sm">
                        <Mail className="w-4 h-4 opacity-40" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(val) => handleRoleChange(user._id, val)}
                      >
                        <SelectTrigger className={`w-32 h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${getRoleBadgeColor(user.role)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border-light rounded-xl">
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted text-xs italic">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted italic">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
