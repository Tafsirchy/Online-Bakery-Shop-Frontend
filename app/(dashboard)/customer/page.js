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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Package, Truck, CheckCircle2, Clock, ShoppingBag, CreditCard, User, Settings, XCircle, Home, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useAuthStore';

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
    <div className="max-w-7xl mx-auto space-y-12 w-full p-10 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto space-y-12"
            >
              <header className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                  <ShoppingBag className="w-4 h-4" />
                  Your Activity
                </div>
                <h1 className="text-5xl md:text-6xl font-serif text-brown tracking-tight leading-tight">My Orders</h1>
                <p className="text-muted text-lg max-w-2xl leading-relaxed">Track your ongoing orders, download invoices, and view your sweet history.</p>
              </header>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-warm bg-white overflow-hidden group">
                  <CardContent className="p-10 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cream-highlight rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-6">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-soft flex items-center justify-center">
                        <ShoppingBag className="w-7 h-7 text-caramel" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total Orders</p>
                        <h3 className="text-5xl font-serif text-brown">{stats.totalOrders}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-warm bg-white overflow-hidden group">
                  <CardContent className="p-10 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cream-highlight rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-6">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-soft flex items-center justify-center">
                        <CreditCard className="w-7 h-7 text-caramel" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total Spent</p>
                        <h3 className="text-5xl font-serif text-brown">৳{stats.totalSpent.toFixed(2)}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-warm bg-white overflow-hidden group">
                  <CardContent className="p-10 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cream-highlight rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 space-y-6">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-soft flex items-center justify-center">
                        <Truck className="w-7 h-7 text-caramel" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Active Deliveries</p>
                        <h3 className="text-5xl font-serif text-brown">{stats.activeOrders}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History Section */}
              <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-3xl font-serif text-brown flex items-center gap-3">
                    <ClipboardList className="w-8 h-8 text-caramel" />
                    Order History
                  </h2>
                  <div className="h-px hidden md:block flex-1 bg-border-light mx-8 opacity-50" />
                  <div className="text-xs font-bold text-muted uppercase tracking-widest bg-white px-6 py-3 rounded-full border border-border-light shadow-sm self-start">
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
                  <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-warm bg-white border border-border-light">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-cream-highlight/50">
                            <TableRow className="hover:bg-transparent border-border-light">
                              <TableHead className="py-6 px-10 font-bold text-brown uppercase text-[10px] tracking-widest">Order ID</TableHead>
                              <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest">Date</TableHead>
                              <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest text-center">Items</TableHead>
                              <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest text-center">Total</TableHead>
                              <TableHead className="py-6 font-bold text-brown uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                              <TableHead className="py-6 px-10 font-bold text-brown uppercase text-[10px] tracking-widest text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order._id} className="hover:bg-cream-highlight/30 transition-colors border-border-light">
                                <TableCell className="py-6 px-10">
                                  <span className="font-mono text-xs font-bold text-brown/60 bg-cream-highlight px-3 py-1.5 rounded-lg border border-border-light">
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
                                    ৳{order.finalPrice.toFixed(2)}
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
                                      className="rounded-full border-border-light hover:bg-sage hover:text-white hover:border-sage transition-all px-6"
                                    >
                                      Track
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => generateInvoice(order)}
                                      className="rounded-full hover:bg-cream-highlight text-muted hover:text-brown"
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
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-24 bg-white rounded-[3rem] border border-border-light shadow-warm flex flex-col items-center">
                    <div className="w-24 h-24 bg-cream-highlight rounded-full flex items-center justify-center mb-8 relative">
                      <div className="absolute inset-0 bg-caramel/5 rounded-full animate-ping" />
                      <Package className="w-10 h-10 text-caramel/50 relative z-10" />
                    </div>
                    <h3 className="text-3xl font-serif text-brown mb-4">No orders yet</h3>
                    <p className="text-muted max-w-md mx-auto mb-10 text-lg">Your order history is currently empty. Let's find some delicious treats to satisfy your cravings!</p>
                    <Button onClick={() => window.location.href = '/shop'} className="rounded-2xl bg-sage hover:bg-brown h-14 px-10 text-white font-bold shadow-lg transition-all hover:scale-105">
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
              className="max-w-4xl mx-auto space-y-10"
            >
              <header className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-serif text-brown tracking-tight">Profile Settings</h1>
                <p className="text-muted text-lg max-w-2xl">Update your personal information and secure your account.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info Card */}
                <Card className="rounded-3xl border-none shadow-soft bg-white">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-serif text-brown mb-6 flex items-center gap-2">
                      <User className="w-6 h-6 text-caramel" />
                      Personal Details
                    </h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          required 
                          className="rounded-xl bg-background border-border-light" 
                          value={profileData.name}
                          onChange={e => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address (Cannot be changed)</Label>
                        <Input 
                          type="email"
                          readOnly 
                          className="rounded-xl bg-gray-50 border-border-light cursor-not-allowed opacity-70" 
                          value={profileData.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mobile Number</Label>
                        <Input 
                          type="tel"
                          placeholder="e.g. 01712345678"
                          className="rounded-xl bg-background border-border-light" 
                          value={profileData.phone}
                          onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Address</Label>
                        <textarea 
                          className="w-full min-h-[100px] rounded-xl bg-background border border-border-light p-3 text-sm outline-none focus:ring-2 focus:ring-sage/20 transition-all"
                          placeholder="Your detailed address..."
                          value={profileData.address}
                          onChange={e => setProfileData({...profileData, address: e.target.value})}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className={`w-full h-12 rounded-xl font-bold shadow-md transition-all ${
                          isProfileChanged && !profileLoading 
                            ? 'bg-sage hover:bg-brown text-white active:scale-[0.98]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                        }`} 
                        disabled={!isProfileChanged || profileLoading}
                      >
                        {profileLoading ? 'Saving...' : 'Save Profile Details'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Password Card */}
                <Card className="rounded-3xl border-none shadow-soft bg-white">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-serif text-brown mb-6 flex items-center gap-2">
                      <Settings className="w-6 h-6 text-sage" />
                      Change Password
                    </h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input 
                          type="password"
                          required 
                          className="rounded-xl bg-background border-border-light" 
                          value={passwordData.currentPassword}
                          onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input 
                          type="password"
                          required 
                          minLength={6}
                          className="rounded-xl bg-background border-border-light" 
                          value={passwordData.newPassword}
                          onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className={`w-full h-12 rounded-xl font-bold shadow-md transition-all ${
                          isPasswordReady && !passwordLoading 
                            ? 'bg-caramel hover:bg-brown text-white active:scale-[0.98]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                        }`} 
                        disabled={!isPasswordReady || passwordLoading}
                      >
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Track Order Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="w-full max-w-lg md:max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="bg-white">
              <div className="p-8 bg-cream-highlight border-b border-border-light flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Order Tracking</h3>
                  <p className="text-2xl font-serif text-brown uppercase">#{selectedOrder.trackingId}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Order Date</h3>
                  <p className="text-lg font-medium text-brown">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="p-10">
                {selectedOrder.status === 'Cancelled' ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-serif text-red-600">Order Cancelled</h3>
                    <p className="text-muted">This order has been cancelled.</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Stepper Line */}
                    <div className="absolute top-[26px] left-10 right-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-sage"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(getStageIndex(selectedOrder.status) / (orderStages.length - 1)) * 100}%` 
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    
                    {/* Steps */}
                    <div className="relative flex justify-between">
                      {orderStages.map((stage, idx) => {
                        const isCompleted = getStageIndex(selectedOrder.status) >= idx;
                        const isCurrent = selectedOrder.status === stage;
                        
                        let Icon = ClipboardList;
                        if(stage === 'Processing') Icon = Package;
                        if(stage === 'Shipped') Icon = Truck;
                        if(stage === 'Delivered') Icon = Home;

                        return (
                          <div key={stage} className="flex flex-col items-center gap-4 z-10 w-24">
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: idx * 0.2 }}
                              className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${isCompleted ? 'bg-sage text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                              <Icon className="w-6 h-6" />
                            </motion.div>
                            <div className="text-center">
                              <p className={`text-sm font-bold ${isCurrent ? 'text-sage' : (isCompleted ? 'text-brown' : 'text-gray-400')}`}>
                                {stage}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-12 flex justify-between items-center pt-6 border-t border-border-light">
                  <div className="flex gap-4 items-center text-muted">
                    <span className="font-bold text-brown">Total: ৳{selectedOrder.finalPrice.toFixed(2)}</span>
                    <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">{selectedOrder.paymentMethod}</span>
                  </div>
                  
                  {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                    isCancellable ? (
                      <Button 
                        variant="destructive" 
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                        disabled={cancelLoading}
                        className="rounded-xl shadow-sm"
                      >
                        {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                      </Button>
                    ) : (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest italic">
                          Cancellation window closed
                        </p>
                        <p className="text-[9px] text-muted">12 hours have passed since confirmation</p>
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
