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
  CreditCard
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-brown font-bold">Orders Management</h1>
            <p className="text-muted">Tracking {orders.length} orders from your hungry customers</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input 
              placeholder="Search by ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-border-light bg-white"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-cream-highlight/30 rounded-[2.5rem] border border-dashed border-border-light">
            <Loader2 className="w-8 h-8 text-sage animate-spin mb-4" />
            <p className="text-muted font-serif italic">Gathering your bake orders...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border-light shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-cream-highlight">
                <TableRow>
                  <TableHead className="font-bold text-brown">Order ID</TableHead>
                  <TableHead className="font-bold text-brown">Customer</TableHead>
                  <TableHead className="font-bold text-brown">Amount</TableHead>
                  <TableHead className="font-bold text-brown">Status</TableHead>
                  <TableHead className="font-bold text-brown">Payment</TableHead>
                  <TableHead className="text-right font-bold text-brown">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-sage/5 transition-colors">
                    <TableCell className="font-mono text-xs text-muted font-bold">
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
                        <SelectTrigger className={`w-32 h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(order.status)}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border-light">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest ${
                        order.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage border-sage/20' : 'bg-red-50 text-red-500 border-red-100'
                      }`}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted hover:text-sage hover:bg-sage/10"
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
                        className="text-muted hover:text-red-500 hover:bg-red-50"
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
        )}

        {/* Order Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="bg-cream-highlight border-border-light rounded-[2.5rem] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-brown">Order Details</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-8 py-4">
                <div className="grid grid-cols-2 gap-8 bg-white/60 p-6 rounded-3xl border border-border-light">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Tracking ID</p>
                    <p className="font-mono font-bold text-brown">{selectedOrder.trackingId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Customer</p>
                    <p className="font-serif font-bold text-brown">{selectedOrder.userId?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Payment Method</p>
                    <div className="flex items-center gap-2 font-bold text-brown">
                      <CreditCard className="w-4 h-4 text-sage" />
                      {selectedOrder.paymentMethod}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Shipping Address</p>
                    <p className="text-xs text-muted leading-relaxed">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-brown px-2">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-border-light shadow-xs">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-cream-highlight overflow-hidden border border-border-light">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-brown font-serif">{item.name}</p>
                            <p className="text-xs text-muted">{item.quantity} x ৳{item.price}</p>
                          </div>
                        </div>
                        <p className="font-bold text-sage">৳{(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brown text-white p-6 rounded-3xl space-y-3">
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Subtotal</span>
                    <span>৳{Number(selectedOrder.totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Shipping Fee</span>
                    <span>৳{Number(selectedOrder.shippingFee).toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm text-caramel">
                      <span>Discount</span>
                      <span>-৳{Number(selectedOrder.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-xl">
                    <span>Total Amount</span>
                    <span>৳{Number(selectedOrder.finalPrice).toFixed(2)}</span>
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
