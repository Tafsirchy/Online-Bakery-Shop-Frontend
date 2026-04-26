'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const { user: authUser, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile State
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setProfileData({ name: authUser.name || '', email: authUser.email || '' });
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
    <div className="flex flex-col md:flex-row min-h-screen bg-brown/5">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-border-light flex flex-col pt-8 px-6 pb-6">
        <h2 className="text-2xl font-serif text-brown font-bold mb-8 tracking-tight">Customer<br/>Portal</h2>
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-sage text-white shadow-md' : 'text-muted hover:bg-cream-highlight hover:text-brown'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">My Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-sage text-white shadow-md' : 'text-muted hover:bg-cream-highlight hover:text-brown'}`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile Settings</span>
          </button>
        </nav>
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/'}
          className="w-full justify-start text-muted hover:text-brown gap-3 mt-auto rounded-xl"
        >
          <Home className="w-5 h-5" />
          Back to Store
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto space-y-10"
            >
              <header className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-serif text-brown tracking-tight">My Orders</h1>
                <p className="text-muted text-lg max-w-2xl">Track your ongoing orders, download invoices, and view your sweet history.</p>
              </header>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-40 bg-cream-highlight rounded-3xl animate-pulse shadow-sm" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="rounded-3xl border-none shadow-soft bg-cream-highlight overflow-hidden relative group h-auto min-h-[160px]">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-sage/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-sage/10 w-fit">
                        <ShoppingBag className="w-6 h-6 text-sage" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Orders</p>
                        <h3 className="text-4xl font-serif text-brown">{stats.totalOrders}</h3>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-none shadow-soft bg-cream-highlight overflow-hidden relative group h-auto min-h-[160px]">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-caramel/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-caramel/10 w-fit">
                        <CreditCard className="w-6 h-6 text-caramel" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Spent</p>
                        <h3 className="text-4xl font-serif text-brown">৳{stats.totalSpent.toFixed(2)}</h3>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-none shadow-soft bg-cream-highlight overflow-hidden relative group h-auto min-h-[160px]">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-brown/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-border-light w-fit">
                        <Truck className="w-6 h-6 text-brown" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Active Deliveries</p>
                        <h3 className="text-4xl font-serif text-brown">{stats.activeOrders}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-brown flex items-center gap-2">Order History</h2>
                {loading ? (
                   <div className="h-[400px] bg-cream-highlight rounded-3xl animate-pulse shadow-soft" />
                ) : orders.length > 0 ? (
                  <Card className="rounded-3xl border-none shadow-soft overflow-hidden bg-cream-highlight relative">
                    <div className="overflow-x-auto custom-scrollbar">
                      <Table className="min-w-[800px]">
                        <TableHeader className="bg-white/50 border-b-0">
                          <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-bold text-brown py-5 rounded-tl-3xl pl-6">Order ID</TableHead>
                            <TableHead className="font-bold text-brown py-5">Date</TableHead>
                            <TableHead className="font-bold text-brown py-5">Items</TableHead>
                            <TableHead className="font-bold text-brown py-5">Total</TableHead>
                            <TableHead className="font-bold text-brown py-5">Status</TableHead>
                            <TableHead className="text-right font-bold text-brown py-5 rounded-tr-3xl pr-6">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow 
                              key={order._id} 
                              className="hover:bg-white/60 transition-colors border-border-light/50 cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <TableCell className="font-medium text-xs text-muted uppercase pl-6">
                                <span className="bg-white px-3 py-1.5 rounded-lg border border-border-light/50 shadow-sm whitespace-nowrap">
                                  {order.trackingId}
                                </span>
                              </TableCell>
                              <TableCell className="font-medium text-brown whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                <span className="text-muted font-medium whitespace-nowrap">{order.products.length} {order.products.length === 1 ? 'Item' : 'Items'}</span>
                              </TableCell>
                              <TableCell className="font-bold text-brown text-base whitespace-nowrap">
                                ৳{order.finalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-full w-fit whitespace-nowrap ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span className="text-[11px] font-bold uppercase tracking-wider">{order.status}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl text-sage hover:text-white hover:bg-sage border-sage/20 whitespace-nowrap"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    Track
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="rounded-xl text-brown hover:bg-brown/10 whitespace-nowrap"
                                    onClick={() => generateInvoice(order)}
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
                  </Card>
                ) : (
                  <div className="text-center py-24 bg-cream-highlight rounded-3xl border-2 border-dashed border-caramel/20 flex flex-col items-center shadow-sm">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft mb-6 relative">
                      <div className="absolute inset-0 bg-caramel/5 rounded-full animate-ping" />
                      <Package className="w-10 h-10 text-caramel/50 relative z-10" />
                    </div>
                    <h3 className="text-3xl font-serif text-brown mb-3">No orders yet</h3>
                    <p className="text-muted max-w-md mx-auto mb-8 text-lg">Your order history is currently empty. Let's find some delicious treats to satisfy your cravings!</p>
                    <Button onClick={() => window.location.href = '/shop'} className="rounded-xl bg-sage hover:bg-brown-hover h-12 px-8 text-white text-base shadow-warm">
                      Browse Shop
                    </Button>
                  </div>
                )}
              </div>
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
                        <Label>Email Address</Label>
                        <Input 
                          type="email"
                          required 
                          className="rounded-xl bg-background border-border-light" 
                          value={profileData.email}
                          onChange={e => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-xl bg-sage hover:bg-brown text-white" disabled={profileLoading}>
                        {profileLoading ? 'Saving...' : 'Save Changes'}
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
                      <Button type="submit" className="w-full rounded-xl bg-caramel hover:bg-brown text-white" disabled={passwordLoading}>
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Track Order Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
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
                    <div className="absolute top-6 left-10 right-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
                    <Button 
                      variant="destructive" 
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={cancelLoading}
                      className="rounded-xl shadow-sm"
                    >
                      {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
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
