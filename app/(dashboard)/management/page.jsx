'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
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
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    avgOrderValue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canViewAnalytics = user?.role === 'admin' || user?.role === 'manager';

    if (!canViewAnalytics) {
      setLoading(false);
      return;
    }

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
  }, [user]);

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
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 md:space-y-8">
      <header className="space-y-0.5">
        <h1 className="text-2xl md:text-3xl font-serif text-brown font-extrabold tracking-tight">Management Overview</h1>
        <p className="text-muted text-xs md:text-base">Tracking your bakery's growth and performance.</p>
      </header>

      {/* Quick Stats Grid: 2 columns on mobile for better density */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 md:h-28 bg-cream-highlight/50 rounded-2xl md:rounded-[2rem] animate-pulse border border-brown/5" />
          ))
        ) : (
          [
            { label: 'Revenue', value: `৳${stats.totalRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-sage', bg: 'bg-[#F1F3E9]' },
            { label: 'Orders', value: stats.totalOrders?.toLocaleString(), icon: ShoppingBag, color: 'text-caramel', bg: 'bg-[#F9F3EB]' },
            { label: 'Users', value: stats.totalUsers?.toLocaleString(), icon: Users, color: 'text-brown', bg: 'bg-[#F2EFEA]' },
            { label: 'Avg Sale', value: `৳${stats.avgOrderValue}`, icon: TrendingUp, color: 'text-sage', bg: 'bg-[#F1F3E9]' },
          ].map((item, i) => (
            <Card key={i} className="rounded-2xl md:rounded-[2rem] border-none shadow-soft bg-white group hover:shadow-warm transition-all duration-500">
              <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 text-center md:text-left">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${item.bg}`}>
                  <item.icon className={`w-5 h-5 md:w-7 md:h-7 ${item.color}`} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[8px] md:text-[10px] text-muted font-bold uppercase tracking-[0.2em]">{item.label}</p>
                  <p className="text-xl md:text-3xl font-serif text-brown font-bold tracking-tight">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Weekly Sales Chart */}
        <Card className="rounded-2xl md:rounded-3xl border-brown/5 shadow-soft p-4 md:p-6">
          <CardHeader className="p-0 mb-4 md:mb-6">
            <CardTitle className="text-lg md:text-xl font-serif text-brown flex items-center justify-between">
              Weekly Revenue
              <span className="text-[10px] font-sans font-bold text-sage bg-sage/10 px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                +12% <ArrowUpRight className="w-3 h-3" />
              </span>
            </CardTitle>
          </CardHeader>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0D5C1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7D6E63', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7D6E63', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFBF2', borderRadius: '12px', border: '1px solid #E0D5C1', fontSize: '12px' }}
                  itemStyle={{ color: '#4A3728' }}
                />
                <Bar dataKey="sales" fill="#8A9A5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Share Chart: Responsive layout for legend */}
        <Card className="rounded-2xl md:rounded-3xl border-brown/5 shadow-soft p-4 md:p-6">
          <CardHeader className="p-0 mb-4 md:mb-6">
            <CardTitle className="text-lg md:text-xl font-serif text-brown">Category Share</CardTitle>
          </CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-[200px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFBF2', borderRadius: '12px', border: '1px solid #E0D5C1', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-col gap-3 w-full sm:w-auto sm:pr-8">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] md:text-xs text-muted font-medium whitespace-nowrap">{cat.name} ({cat.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Products Gallery */}
      <Card className="rounded-2xl md:rounded-3xl border-brown/5 shadow-soft p-6 md:p-8">
        <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl font-serif text-brown">Recent Creations</CardTitle>
            <p className="text-xs md:text-sm text-muted">Latest additions to your catalog</p>
          </div>
          <Link href="/admin/products" className="text-sage font-bold text-[10px] md:text-sm uppercase tracking-widest hover:underline">View All</Link>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {recentProducts.map((product) => (
            <div key={product._id} className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-brown/5 bg-cream-highlight shadow-sm hover:shadow-md transition-all">
              <img
                src={product.imageUrl?.split(',')[0] || '/placeholder-bakery.jpg'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-white text-[8px] md:text-[10px] font-bold truncate">{product.name}</p>
                <p className="text-caramel text-[8px] font-bold">৳{product.price}</p>
              </div>
            </div>
          ))}
          {recentProducts.length === 0 && (
            <div className="col-span-full h-32 flex items-center justify-center border border-dashed border-brown/5 rounded-2xl">
              <p className="text-muted  text-sm">No recent creations found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
