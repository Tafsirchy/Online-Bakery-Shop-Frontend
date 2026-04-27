'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight 
} from 'lucide-react';

export default function ManagementDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    avgOrderValue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes] = await Promise.all([
          axios.get('/orders/stats'),
          axios.get('/products?limit=5&sort=-createdAt')
        ]);
        setStats(statsRes.data.data);
        setRecentProducts(productsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock data for charts (can be expanded later with real time-series data)
  const salesData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 800 },
    { name: 'Fri', sales: 500 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 700 },
  ];

  const categoryData = [
    { name: 'Cakes', value: 400 },
    { name: 'Pastries', value: 300 },
    { name: 'Cookies', value: 200 },
    { name: 'Bread', value: 150 },
  ];

  const COLORS = ['#8A9A5B', '#D4A373', '#4A3728', '#E0D5C1'];

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif text-brown font-bold">Management Overview</h1>
        <p className="text-muted">Tracking your bakery's growth and performance.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-sage', bg: 'bg-sage/10' },
          { label: 'Total Orders', value: stats.totalOrders?.toLocaleString(), icon: ShoppingBag, color: 'text-caramel', bg: 'bg-caramel/10' },
          { label: 'Total Users', value: stats.totalUsers?.toLocaleString(), icon: Users, color: 'text-brown', bg: 'bg-brown/10' },
          { label: 'Avg. Order', value: `$${stats.avgOrderValue}`, icon: TrendingUp, color: 'text-sage', bg: 'bg-sage/10' },
        ].map((item, i) => (
          <Card key={i} className="rounded-3xl border-border-light shadow-soft overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-serif text-brown font-bold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Sales Chart */}
        <Card className="rounded-3xl border-border-light shadow-soft p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-serif text-brown flex items-center justify-between">
              Weekly Revenue
              <span className="text-xs font-sans text-sage bg-sage/10 px-2 py-1 rounded-full flex items-center gap-1">
                +12% <ArrowUpRight className="w-3 h-3" />
              </span>
            </CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0D5C1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7D6E63', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#7D6E63', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#FFFBF2', borderRadius: '12px', border: '1px solid #E0D5C1'}}
                  itemStyle={{color: '#4A3728'}}
                />
                <Bar dataKey="sales" fill="#8A9A5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Share Chart */}
        <Card className="rounded-3xl border-border-light shadow-soft p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-serif text-brown">Category Share</CardTitle>
          </CardHeader>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#FFFBF2', borderRadius: '12px', border: '1px solid #E0D5C1'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-8">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                  <span className="text-xs text-muted whitespace-nowrap">{cat.name} ({cat.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Dynamic Content: Recent Products Gallery */}
      <Card className="rounded-3xl border-border-light shadow-soft p-8">
        <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-serif text-brown">Recent Bakery Creations</CardTitle>
            <p className="text-sm text-muted">Latest additions to your dynamic catalog</p>
          </div>
          <Link href="/admin/products" className="text-sage font-bold text-sm hover:underline">View All Products</Link>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentProducts.map((product) => (
            <div key={product._id} className="group relative aspect-square rounded-2xl overflow-hidden border border-border-light bg-cream-highlight shadow-sm hover:shadow-md transition-all">
              <img 
                src={product.imageUrl?.split(',')[0] || '/placeholder-bakery.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-white text-[10px] font-bold truncate">{product.name}</p>
                <p className="text-caramel text-[8px] font-bold">${product.price}</p>
              </div>
            </div>
          ))}
          {recentProducts.length === 0 && (
            <div className="col-span-full h-32 flex items-center justify-center border border-dashed border-border-light rounded-2xl">
              <p className="text-muted italic text-sm">No recent creations found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
