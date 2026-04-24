'use client';

import { useState, useEffect } from 'react';
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
import { Download, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
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
      case 'Pending': return <Clock className="w-4 h-4 text-caramel" />;
      case 'Processing': return <Truck className="w-4 h-4 text-sage" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4 text-sage" />;
      default: return <Package className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-serif text-brown">My Orders</h1>
          <p className="text-muted text-lg">Track your treats and download invoices.</p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-cream-highlight rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <Card className="rounded-3xl border-border-light shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-cream-highlight">
                <TableRow>
                  <TableHead className="font-bold text-brown">Order ID</TableHead>
                  <TableHead className="font-bold text-brown">Date</TableHead>
                  <TableHead className="font-bold text-brown">Items</TableHead>
                  <TableHead className="font-bold text-brown">Total</TableHead>
                  <TableHead className="font-bold text-brown">Status</TableHead>
                  <TableHead className="text-right font-bold text-brown">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-sage/5 transition-colors">
                    <TableCell className="font-medium text-xs text-muted uppercase">{order.trackingId}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{order.products.length} Items</TableCell>
                    <TableCell className="font-bold text-brown">${order.finalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 px-3 py-1 bg-background border border-border-light rounded-full w-fit">
                        {getStatusIcon(order.status)}
                        <span className="text-xs font-medium uppercase tracking-wider">{order.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg text-sage hover:text-brown hover:bg-cream-highlight"
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
          </Card>
        ) : (
          <div className="text-center py-20 bg-cream-highlight rounded-3xl border border-dashed border-border-light">
            <Package className="w-16 h-16 text-caramel/20 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-brown">No orders yet</h3>
            <p className="text-muted">Once you order some treats, they will appear here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
