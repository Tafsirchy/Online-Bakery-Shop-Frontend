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
  Box, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Loader2,
  Trash2,
  Eye,
  CreditCard,
  ShoppingBag,
  X,
  User,
  ClipboardList
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import Pagination from '@/components/shared/Pagination';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders');
      setOrders(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Box className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-serif text-brown font-bold">Orders Management</h1>
            <p className="text-muted text-xs md:text-sm">Tracking {orders.length} orders from your hungry customers</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input 
              placeholder="Search ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-brown/10 bg-white"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-cream-highlight/30 rounded-3xl border border-dashed border-brown/10">
            <Loader2 className="w-8 h-8 text-sage animate-spin mb-4" />
            <p className="text-muted font-serif italic text-sm">Gathering bake orders...</p>
          </div>
        ) : (
          <>
            {/* Mobile Order Cards (Visible only on SM/MD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                <div key={order._id} className="bg-white rounded-2xl p-5 border border-brown/5 shadow-soft space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-caramel" />
                        <span className="font-mono text-[10px] text-muted font-bold tracking-tight uppercase">#{order.trackingId}</span>
                      </div>
                      <h4 className="font-serif text-brown font-bold text-lg">{order.userId?.name || 'Guest'}</h4>
                      <p className="text-[10px] text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sage font-bold text-lg">৳{Number(order.finalPrice).toFixed(0)}</p>
                      <Badge variant="outline" className={`mt-1 rounded-md px-1.5 py-0 text-[8px] uppercase font-bold tracking-widest ${
                        order.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage border-sage/20' : 'bg-red-50 text-red-500 border-red-100'
                      }`}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-brown/5">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-brown opacity-50">Current Status</Label>
                      <Select 
                        value={order.status} 
                        onValueChange={(val) => handleStatusChange(order._id, val)}
                      >
                        <SelectTrigger className={`w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-none shadow-sm ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-brown/10 rounded-xl z-50">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 h-11 rounded-xl bg-white border border-brown/10 text-brown font-bold text-xs flex gap-2 items-center justify-center hover:bg-cream-highlight transition-colors"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View Full Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100"
                        onClick={() => handleDeleteOrder(order._id)}
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
                    <TableHead className="font-bold text-brown">Order ID</TableHead>
                    <TableHead className="font-bold text-brown">Customer</TableHead>
                    <TableHead className="font-bold text-brown">Amount</TableHead>
                    <TableHead className="font-bold text-brown">Status</TableHead>
                    <TableHead className="font-bold text-brown">Payment</TableHead>
                    <TableHead className="text-right font-bold text-brown px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                    <TableRow key={order._id} className="hover:bg-brown/[0.01] border-brown/5 transition-colors">
                      <TableCell className="font-mono text-[10px] text-muted font-bold">
                        {order.trackingId}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-brown font-serif">{order.userId?.name || 'Guest'}</div>
                        <div className="text-[10px] text-muted">{new Date(order.createdAt).toLocaleString()}</div>
                      </TableCell>
                      <TableCell className="font-bold text-sage">
                        ৳{Number(order.finalPrice).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(val) => handleStatusChange(order._id, val)}
                        >
                          <SelectTrigger className={`w-32 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(order.status)}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-white border-brown/5">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-lg px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                          order.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage border-sage/20' : 'bg-red-50 text-red-500 border-red-100'
                        }`}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1 px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-muted hover:text-sage hover:bg-sage/10"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDetailsOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-muted hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteOrder(order._id)}
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
                totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredOrders.length}
              />
            </div>
          </>
        )}

        {/* Order Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent showCloseButton={false} className="bg-cream-highlight border-brown/5 rounded-2xl w-[95vw] sm:w-[90vw] md:max-w-4xl p-0 overflow-hidden shadow-2xl">
            {selectedOrder && (
              <div className="flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-r from-brown to-[#5a3828] px-5 py-4 text-white border-b border-white/10 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-caramel" />
                      </div>
                      <div className="space-y-0.5">
                        <h2 className="text-lg md:text-xl font-serif text-white font-extrabold leading-tight tracking-[0.01em]">
                          Order Details
                        </h2>
                        <p className="text-[10px] text-caramel/95 uppercase tracking-[0.2em] font-bold">#{selectedOrder.trackingId}</p>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                        <X className="w-6 h-6" />
                      </Button>
                    </DialogClose>
                  </div>
                </div>

                <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 bg-white/40 backdrop-blur-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-white p-5 md:p-6 rounded-2xl border border-brown/5 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[9px] text-muted font-bold uppercase tracking-widest">
                        <User className="w-3 h-3 text-caramel" />
                        Customer
                      </div>
                      <p className="font-serif font-bold text-brown text-lg">{selectedOrder.userId?.name || 'Guest'}</p>
                      <p className="text-[10px] text-muted">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[9px] text-muted font-bold uppercase tracking-widest">
                        <CreditCard className="w-3 h-3 text-sage" />
                        Payment
                      </div>
                      <p className="font-bold text-brown text-sm">{selectedOrder.paymentMethod}</p>
                      <Badge variant="outline" className={`mt-1 rounded-md px-1.5 py-0 text-[8px] uppercase font-bold tracking-widest ${
                        selectedOrder.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage border-sage/20' : 'bg-red-50 text-red-500 border-red-100'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[9px] text-muted font-bold uppercase tracking-widest">
                        <Truck className="w-3 h-3 text-caramel" />
                        Shipping
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {typeof selectedOrder.shippingAddress === 'object' 
                          ? `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.zipCode}`
                          : selectedOrder.shippingAddress}
                      </p>
                      {selectedOrder.shippingAddress?.phone && (
                        <p className="text-[10px] font-bold text-brown/70">Tel: {selectedOrder.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-start">
                    <div className="lg:col-span-3 space-y-4">
                      <h3 className="font-serif text-lg md:text-xl text-brown flex items-center gap-2">
                        <Box className="w-5 h-5 text-caramel" />
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.products.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-brown/5 shadow-xs">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-cream-highlight overflow-hidden border border-brown/5 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-brown font-serif truncate text-sm">{item.name}</p>
                                <p className="text-[10px] text-muted font-bold">{item.quantity} × ৳{item.price}</p>
                              </div>
                            </div>
                            <p className="font-bold text-sage text-sm">৳{(item.quantity * item.price).toFixed(0)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="font-serif text-lg md:text-xl text-brown flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-caramel" />
                        Summary
                      </h3>
                      <div className="bg-brown text-white p-6 rounded-3xl shadow-xl space-y-4">
                        <div className="space-y-2 pb-4 border-b border-white/10">
                          <div className="flex justify-between text-xs opacity-70">
                            <span>Subtotal</span>
                            <span>৳{Number(selectedOrder.totalPrice).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-xs opacity-70">
                            <span>Shipping</span>
                            <span>৳{Number(selectedOrder.shippingFee || 60).toFixed(0)}</span>
                          </div>
                          {selectedOrder.discount > 0 && (
                            <div className="flex justify-between text-xs text-caramel font-bold">
                              <span>Discount</span>
                              <span>-৳{Number(selectedOrder.discount).toFixed(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-base">Total</span>
                          <span className="text-xl md:text-2xl text-caramel font-serif">৳{Number(selectedOrder.finalPrice).toFixed(0)}</span>
                        </div>
                        <div className="pt-2">
                           <div className="w-full py-2 bg-white/10 rounded-xl text-center text-[8px] uppercase tracking-widest font-bold text-white/40 border border-white/5">
                             via {selectedOrder.paymentMethod}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
