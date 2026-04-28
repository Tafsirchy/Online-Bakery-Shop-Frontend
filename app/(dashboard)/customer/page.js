'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import { generateInvoice } from '@/utils/generateInvoice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Package, Truck, CheckCircle2, Clock, ShoppingBag, CreditCard, User, Settings, XCircle, Home, ClipboardList, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useAuthStore';
import Pagination from '@/components/shared/Pagination';

export default function CustomerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" /></div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}
function CustomerDashboardContent() {
  const { user: authUser, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const [loading, setLoading] = useState(true);

  // Profile State
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', address: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form Change Tracking
  const isProfileChanged = useMemo(() => {
    if (!authUser) return false;
    return (
      profileData.name !== (authUser.name || '') ||
      profileData.phone !== (authUser.phone || '') ||
      profileData.address !== (authUser.address || '')
    );
  }, [profileData, authUser]);

  const isPasswordReady = useMemo(() => {
    return passwordData.currentPassword.trim() !== '' && passwordData.newPassword.length >= 6;
  }, [passwordData]);

  const isCancellable = useMemo(() => {
    if (!selectedOrder) return false;
    if (selectedOrder.status !== 'Pending' && selectedOrder.status !== 'Processing') return false;
    
    const orderTime = new Date(selectedOrder.createdAt).getTime();
    const currentTime = new Date().getTime();
    const twelveHoursInMs = 12 * 60 * 60 * 1000;
    
    return (currentTime - orderTime) < twelveHoursInMs;
  }, [selectedOrder]);

  useEffect(() => {
    if (authUser) {
      setProfileData({ 
        name: authUser.name || '', 
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: authUser.address || ''
      });
    }
  }, [authUser]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/orders/myorders');
      setOrders(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await axios.put('/auth/updatedetails', profileData);
      toast.success('Profile updated successfully!');
      checkAuth(); // refresh user in store
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await axios.put('/auth/updatepassword', passwordData);
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelLoading(true);
    try {
      const response = await axios.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      setOrders(orders.map(o => o._id === orderId ? response.data.data : o));
      setSelectedOrder(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-caramel/10 text-caramel border-caramel/20';
      case 'Processing': return 'bg-sage/10 text-sage border-sage/20';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = useMemo(() => {
    if (!orders.length) return { totalOrders: 0, totalSpent: 0, activeOrders: 0 };
    const totalSpent = orders.reduce((sum, order) => {
      if (order.status !== 'Cancelled') return sum + (order.finalPrice || 0);
      return sum;
    }, 0);
    const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    return { totalOrders: orders.length, totalSpent, activeOrders };
  }, [orders]);

  const orderStages = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const getStageIndex = (status) => orderStages.indexOf(status);

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 w-full p-4 md:p-6 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto space-y-8 md:space-y-12"
            >
              <header className="space-y-3 md:space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-sage/10 text-sage rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Your Activity
                </div>
                <h1 className="text-3xl md:text-6xl font-serif text-brown tracking-tight leading-tight">My Orders</h1>
                <p className="text-muted text-sm md:text-lg max-w-2xl leading-relaxed">Track your ongoing orders and view your history.</p>
              </header>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-3 md:gap-8">
                <Card className="rounded-2xl md:rounded-[2.5rem] border-none shadow-soft bg-white overflow-hidden group">
                  <CardContent className="p-4 md:p-10 relative flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-cream-highlight rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-2 md:space-y-6 flex flex-col items-center md:items-start">
                      <div className="w-8 h-8 md:w-14 md:h-14 bg-white rounded-lg md:rounded-2xl shadow-soft flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 md:w-7 md:h-7 text-caramel" />
                      </div>
                      <div>
                        <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest mb-0.5 md:mb-1">Orders</p>
                        <h3 className="text-xl md:text-5xl font-serif text-brown">{stats.totalOrders}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl md:rounded-[2.5rem] border-none shadow-soft bg-white overflow-hidden group">
                  <CardContent className="p-4 md:p-10 relative flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-cream-highlight rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-2 md:space-y-6 flex flex-col items-center md:items-start">
                      <div className="w-8 h-8 md:w-14 md:h-14 bg-white rounded-lg md:rounded-2xl shadow-soft flex items-center justify-center">
                        <CreditCard className="w-4 h-4 md:w-7 md:h-7 text-caramel" />
                      </div>
                      <div>
                        <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest mb-0.5 md:mb-1">Spent</p>
                        <h3 className="text-xl md:text-5xl font-serif text-brown">৳{stats.totalSpent.toFixed(0)}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl md:rounded-[2.5rem] border-none shadow-soft bg-white overflow-hidden group">
                  <CardContent className="p-4 md:p-10 relative flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-cream-highlight rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-2 md:space-y-6 flex flex-col items-center md:items-start">
                      <div className="w-8 h-8 md:w-14 md:h-14 bg-white rounded-lg md:rounded-2xl shadow-soft flex items-center justify-center">
                        <Truck className="w-4 h-4 md:w-7 md:h-7 text-caramel" />
                      </div>
                      <div>
                        <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest mb-0.5 md:mb-1">Active</p>
                        <h3 className="text-xl md:text-5xl font-serif text-brown">{stats.activeOrders}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History Section */}
              <section className="space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-brown flex items-center gap-3">
                    <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-caramel" />
                    Order History
                  </h2>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-brown/5 shadow-sm self-start">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-cream-highlight rounded-3xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <>
                    {/* Mobile Order Cards (Visible only on SM/MD) */}
                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                      {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl p-5 border border-brown/5 shadow-soft space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="font-mono text-[10px] font-bold text-brown/40 bg-cream-highlight px-2 py-1 rounded border border-brown/5">
                                #{order.trackingId}
                              </span>
                              <p className="text-[10px] text-muted font-medium pt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-brown/5">
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Total Amount</p>
                              <p className="text-xl font-serif text-brown font-black">৳{order.finalPrice.toFixed(0)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSelectedOrder(order)}
                                className="h-10 rounded-xl border-brown/10 hover:bg-sage hover:text-white px-4 text-xs"
                              >
                                Track
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => generateInvoice(order)}
                                className="h-10 w-10 rounded-xl hover:bg-cream-highlight text-muted"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View (Visible only on LG+) */}
                    <div className="hidden lg:block bg-white rounded-[2.5rem] overflow-hidden border border-brown/5 shadow-soft">
                      <Table>
                        <TableHeader className="bg-cream-highlight/50">
                          <TableRow className="border-brown/5">
                            <TableHead className="py-6 px-10 font-bold text-brown uppercase text-[10px] tracking-widest">Order ID</TableHead>
                            <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest">Date</TableHead>
                            <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest text-center">Items</TableHead>
                            <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest text-center">Total</TableHead>
                            <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                            <TableHead className="py-6 px-10 font-bold text-brown uppercase text-[10px] tracking-widest text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                            <TableRow key={order._id} className="hover:bg-brown/[0.01] border-brown/5 transition-colors">
                              <TableCell className="py-6 px-10">
                                <span className="font-mono text-xs font-bold text-brown/60 bg-cream-highlight px-3 py-1.5 rounded-lg border border-brown/5">
                                  #{order.trackingId}
                                </span>
                              </TableCell>
                              <TableCell className="py-6 font-medium text-muted">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </TableCell>
                              <TableCell className="py-6 text-center font-medium text-muted">
                                {order.products.length} {order.products.length === 1 ? 'Item' : 'Items'}
                              </TableCell>
                              <TableCell className="py-6 text-center">
                                <span className="text-xl font-serif text-brown font-bold">
                                  ৳{order.finalPrice.toFixed(0)}
                                </span>
                              </TableCell>
                              <TableCell className="py-6 text-center">
                                <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell className="py-6 px-10 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setSelectedOrder(order)}
                                    className="rounded-full border-brown/10 hover:bg-sage hover:text-white hover:border-sage px-6"
                                  >
                                    Track
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => generateInvoice(order)}
                                    className="rounded-full hover:bg-cream-highlight text-muted"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="pt-4">
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={Math.ceil(orders.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={orders.length}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 md:py-24 bg-white rounded-[2rem] md:rounded-[3rem] border border-brown/5 shadow-soft flex flex-col items-center p-6">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-cream-highlight rounded-full flex items-center justify-center mb-6 md:mb-8">
                      <Package className="w-8 h-8 md:w-10 md:h-10 text-caramel/50" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-brown mb-3">No orders yet</h3>
                    <p className="text-muted max-w-md mx-auto mb-8 text-sm md:text-lg">Your history is empty. Time to treat yourself!</p>
                    <Button onClick={() => window.location.href = '/shop'} className="w-full sm:w-auto rounded-xl bg-sage hover:bg-brown h-12 md:h-14 px-10 text-white font-bold transition-all">
                      Browse Shop
                    </Button>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-8 md:space-y-10"
            >
              <header className="flex flex-col sm:flex-row items-center sm:justify-start justify-center gap-4 sm:gap-6 bg-white p-6 sm:p-0 rounded-2xl sm:bg-transparent shadow-soft sm:shadow-none border border-brown/5 sm:border-none text-center sm:text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-sage/10 border-2 border-sage/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl md:text-3xl font-serif font-bold text-sage">
                    {authUser?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                    {authUser?.role || 'Customer'} Account
                  </p>
                  <h1 className="text-3xl md:text-4xl font-serif text-brown tracking-tight leading-tight">
                    {authUser?.name?.split(' ')[0] || 'Profile'}
                  </h1>
                  <p className="text-muted text-xs md:text-sm mt-1">{authUser?.email}</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Personal Info Card */}
                <Card className="rounded-3xl border-none shadow-soft bg-white">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-serif text-brown mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 md:w-6 md:h-6 text-caramel" />
                      Details
                    </h2>
                    <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-4 md:space-y-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-brown/60 tracking-widest">Full Name</Label>
                        <Input 
                          required 
                          className="h-12 rounded-xl bg-background border-brown/5" 
                          value={profileData.name}
                          onChange={e => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-brown/60 tracking-widest">Email (Read Only)</Label>
                        <Input 
                          readOnly 
                          className="h-12 rounded-xl bg-gray-50 border-brown/5 opacity-70" 
                          value={profileData.email}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase font-bold text-brown/60 tracking-widest">Phone</Label>
                        <Input 
                          className="h-12 rounded-xl bg-background border-brown/5" 
                          value={profileData.phone}
                          onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs uppercase font-bold text-brown/60 tracking-widest">Address</Label>
                        <textarea 
                          id="address"
                          aria-label="Delivery Address"
                          className="w-full min-h-[100px] rounded-xl bg-background border border-brown/5 p-3 text-sm outline-none focus:ring-1 focus:ring-sage transition-all resize-none"
                          value={profileData.address}
                          onChange={e => setProfileData({...profileData, address: e.target.value})}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className={`hidden sm:flex w-full h-12 rounded-xl font-bold transition-all ${
                          isProfileChanged && !profileLoading ? 'bg-sage text-white' : 'bg-gray-100 text-gray-400'
                        }`} 
                        disabled={!isProfileChanged || profileLoading}
                      >
                        {profileLoading ? 'Saving...' : 'Update Profile'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Password Card (Collapsible on Mobile) */}
                <div className="space-y-4">
                  <div className="md:hidden">
                    <button
                      type="button"
                      onClick={() => setShowSecurity(prev => !prev)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-brown/5 shadow-soft"
                    >
                      <span className="flex items-center gap-2 font-bold text-brown text-sm">
                        <Settings className="w-4 h-4 text-sage" /> Change Password
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showSecurity ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  <div className={`md:block ${showSecurity ? 'block' : 'hidden'}`}>
                    <Card className="rounded-3xl border-none shadow-soft bg-white">
                      <CardContent className="p-6 md:p-8">
                        <h2 className="hidden md:flex text-xl md:text-2xl font-serif text-brown mb-6 items-center gap-2">
                          <Settings className="w-5 h-5 md:w-6 md:h-6 text-sage" />
                          Security
                        </h2>
                        <form onSubmit={handleUpdatePassword} className="space-y-4 md:space-y-5">
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-brown/60 tracking-widest">Current Password</Label>
                            <Input 
                              type="password"
                              required 
                              className="h-12 rounded-xl bg-background border-brown/5" 
                              value={passwordData.currentPassword}
                              onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs uppercase font-bold text-brown/60 tracking-widest">New Password</Label>
                            <Input 
                              type="password"
                              required 
                              minLength={6}
                              className="h-12 rounded-xl bg-background border-brown/5" 
                              value={passwordData.newPassword}
                              onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className={`w-full h-12 rounded-xl font-bold transition-all ${
                              isPasswordReady && !passwordLoading ? 'bg-caramel text-white' : 'bg-gray-100 text-gray-400'
                            }`} 
                            disabled={!isPasswordReady || passwordLoading}
                          >
                            {passwordLoading ? 'Updating...' : 'Change Password'}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Sticky bottom CTA - SM only */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-brown/5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-30 sm:hidden">
                <Button
                  type="submit"
                  form="profile-form"
                  className={`w-full h-14 rounded-2xl font-bold text-sm transition-all ${
                    isProfileChanged && !profileLoading
                      ? 'bg-sage text-white shadow-lg shadow-sage/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  disabled={!isProfileChanged || profileLoading}
                >
                  {profileLoading ? 'Saving...' : 'Update Profile'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Track Order Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent showCloseButton={false} className="w-[95vw] max-w-lg md:max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="bg-white">
              <div className="p-6 md:p-8 bg-cream-highlight border-b border-brown/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                <div>
                  <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Order Tracker</h3>
                  <p className="text-xl md:text-2xl font-serif text-brown uppercase pr-8 sm:pr-0">#{selectedOrder.trackingId}</p>
                </div>
                <div className="sm:text-right pr-8 sm:pr-10">
                  <h3 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Date Placed</h3>
                  <p className="text-sm md:text-lg font-medium text-brown">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" className="absolute top-4 right-4 h-10 w-10 p-0 rounded-full text-brown/50 hover:text-brown hover:bg-brown/5 transition-colors">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
              
              <div className="p-6 md:p-10">
                {selectedOrder.status === 'Cancelled' ? (
                  <div className="text-center py-6 md:py-10 space-y-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-red-600">Order Cancelled</h3>
                    <p className="text-muted text-sm italic">This order is no longer being processed.</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                     {/* Stepper (Simplified for mobile) */}
                     <div className="relative flex flex-col gap-0">
                        {orderStages.map((stage, idx) => {
                          const isCompleted = getStageIndex(selectedOrder.status) >= idx;
                          const isCurrent = selectedOrder.status === stage;
                          const isLast = idx === orderStages.length - 1;
                          
                          let Icon = ClipboardList;
                          if(stage === 'Processing') Icon = Package;
                          if(stage === 'Shipped') Icon = Truck;
                          if(stage === 'Delivered') Icon = Home;

                          return (
                            <div key={stage} className="flex items-start gap-5 relative">
                               {!isLast && (
                                 <div className="absolute left-5 top-10 w-[2px] h-full bg-brown/5 -z-0">
                                   <div className={`w-full transition-all duration-700 bg-sage ${isCompleted ? 'h-full' : 'h-0'}`} />
                                 </div>
                               )}
                               <div className={`w-10 h-10 rounded-xl z-10 flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-sage border-sage text-white' : 'bg-white border-brown/5 text-brown/20'}`}>
                                  <Icon className="w-5 h-5" />
                               </div>
                               <div className="flex-1 pb-6 min-w-0 pt-2">
                                  <p className={`text-xs font-bold uppercase tracking-widest ${isCurrent ? 'text-sage' : (isCompleted ? 'text-brown' : 'text-brown/20')}`}>
                                    {stage}
                                  </p>
                                  {isCurrent && <p className="text-[9px] text-muted italic mt-0.5">In Progress...</p>}
                               </div>
                               {isCompleted && !isCurrent && <CheckCircle2 className="w-4 h-4 text-sage mt-3 shrink-0" />}
                            </div>
                          );
                        })}
                     </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-brown/5 gap-4">
                  <div className="flex gap-4 items-center w-full sm:w-auto justify-between sm:justify-start">
                    <span className="font-serif font-black text-brown text-lg md:text-xl">৳{selectedOrder.finalPrice.toFixed(0)}</span>
                    <span className="text-[10px] px-3 py-1 bg-cream-highlight rounded-full uppercase font-bold tracking-widest">{selectedOrder.paymentMethod}</span>
                  </div>
                  
                  {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                    isCancellable ? (
                      <Button 
                        variant="destructive" 
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                        disabled={cancelLoading}
                        className="w-full sm:w-auto rounded-xl h-11 text-xs font-bold"
                      >
                        {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                      </Button>
                    ) : (
                      <div className="text-center sm:text-right">
                        <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest italic">
                          Closed
                        </p>
                        <p className="text-[8px] text-muted">12hr limit passed</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
