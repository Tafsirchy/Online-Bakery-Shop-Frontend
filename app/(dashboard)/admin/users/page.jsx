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
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import Pagination from '@/components/shared/Pagination';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-serif text-brown font-bold tracking-tight">Community Management</h1>
            <p className="text-muted text-xs md:text-sm ">Manage roles and permissions for your {users.length} members</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-brown/10 bg-white shadow-sm"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-cream-highlight/30 rounded-3xl border border-dashed border-brown/10">
            <Loader2 className="w-8 h-8 text-sage animate-spin mb-4" />
            <p className="text-muted font-serif  text-sm">Loading community members...</p>
          </div>
        ) : (
          <>
            {/* Mobile Member Cards (Visible only on SM/MD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                <div key={user._id} className="bg-white rounded-2xl p-5 border border-brown/5 shadow-soft space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-cream-highlight flex items-center justify-center border border-brown/5 shadow-inner">
                      <User className="w-6 h-6 text-brown/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-brown font-bold text-lg truncate">{user.name}</h4>
                      <div className="flex items-center gap-1.5 text-muted text-[10px]">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-brown/5">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-brown opacity-50">Assigned Role</Label>
                      <Select
                        value={user.role}
                        onValueChange={(val) => handleRoleChange(user._id, val)}
                      >
                        <SelectTrigger className={`w-full h-11 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${getRoleBadgeColor(user.role)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-brown/10 rounded-xl">
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-muted ">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible only on LG+) */}
            <div className="hidden lg:block bg-white rounded-3xl border border-brown/5 shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-cream-highlight/50">
                  <TableRow className="border-brown/5">
                    <TableHead className="font-bold text-brown">Member</TableHead>
                    <TableHead className="font-bold text-brown">Email Address</TableHead>
                    <TableHead className="font-bold text-brown">Role</TableHead>
                    <TableHead className="font-bold text-brown">Joined On</TableHead>
                    <TableHead className="text-right font-bold text-brown px-6">Management</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                    <TableRow key={user._id} className="hover:bg-brown/[0.01] border-brown/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cream-highlight flex items-center justify-center border border-brown/5 shadow-inner">
                            <User className="w-4 h-4 text-brown/40" />
                          </div>
                          <span className="font-bold text-brown font-serif">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted text-sm">
                          <Mail className="w-3.5 h-3.5 opacity-40" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(val) => handleRoleChange(user._id, val)}
                        >
                          <SelectTrigger className={`w-32 h-9 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${getRoleBadgeColor(user.role)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-brown/5 rounded-xl">
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted text-xs ">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="pt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
