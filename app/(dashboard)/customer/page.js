'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from '@/lib/axios';
import { generateInvoice } from '@/utils/generateInvoice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Download, Package, Truck, CheckCircle2, Clock, ShoppingBag, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders/myorders');
        setOrders(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-caramel/10 text-caramel border-caramel/20';
      case 'Processing': return 'bg-sage/10 text-sage border-sage/20';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!orders.length) return { totalOrders: 0, totalSpent: 0, activeOrders: 0 };
    
    const totalSpent = orders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
    const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    
    return {
      totalOrders: orders.length,
      totalSpent,
      activeOrders
    };
  }, [orders]);

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-brown/5 min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-3 pt-4">
          <h1 className="text-4xl md:text-5xl font-serif text-brown tracking-tight">My Dashboard</h1>
          <p className="text-muted text-lg max-w-2xl">Welcome back! Here you can track your ongoing orders, download invoices, and view your sweet history.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-cream-highlight rounded-3xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-3xl border-none shadow-soft bg-cream-highlight overflow-hidden relative group h-40">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-sage/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-sage/10">
                    <ShoppingBag className="w-6 h-6 text-sage" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Orders</p>
                  <h3 className="text-4xl font-serif text-brown">{stats.totalOrders}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-soft bg-cream-highlight overflow-hidden relative group h-40">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-caramel/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-caramel/10">
                    <CreditCard className="w-6 h-6 text-caramel" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Total Spent</p>
                  <h3 className="text-4xl font-serif text-brown">৳{stats.totalSpent.toFixed(2)}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-soft bg-cream-highlight overflow-hidden relative group h-40">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-brown/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-border-light">
                    <Truck className="w-6 h-6 text-brown" />
                  </div>
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
          <h2 className="text-2xl font-serif text-brown flex items-center gap-2">
            Order History
          </h2>
          
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
                      <TableRow key={order._id} className="hover:bg-white/40 transition-colors border-border-light/50">
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
                        <TableCell className="text-right pr-6">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl text-sage hover:text-white hover:bg-sage transition-all shadow-sm bg-white border border-sage/20 whitespace-nowrap"
                            onClick={() => generateInvoice(order)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-cream-highlight rounded-3xl border-2 border-dashed border-caramel/20 flex flex-col items-center shadow-sm"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft mb-6 relative">
                <div className="absolute inset-0 bg-caramel/5 rounded-full animate-ping" />
                <Package className="w-10 h-10 text-caramel/50 relative z-10" />
              </div>
              <h3 className="text-3xl font-serif text-brown mb-3">No orders yet</h3>
              <p className="text-muted max-w-md mx-auto mb-8 text-lg">Your order history is currently empty. Let's find some delicious treats to satisfy your cravings!</p>
              <Button onClick={() => window.location.href = '/shop'} className="rounded-xl bg-sage hover:bg-brown-hover h-12 px-8 text-white text-base shadow-warm">
                Browse Shop
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
