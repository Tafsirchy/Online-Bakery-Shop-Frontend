'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import {
  Ticket,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Loader2,
  Calendar,
  DollarSign,
  Percent,
  CheckCircle2,
  XCircle,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import Pagination from '@/components/shared/Pagination';

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [globalToggling, setGlobalToggling] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    minPurchase: '0',
    isActive: true,
    image: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/coupons');
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        minPurchase: coupon.minPurchase,
        isActive: coupon.isActive,
        image: coupon.image || ''
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount: '',
        expiryDate: '',
        minPurchase: '0',
        isActive: true,
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await axios.put(`/coupons/${editingCoupon._id}`, formData);
        toast.success('Coupon updated successfully');
      } else {
        await axios.post('/coupons', formData);
        toast.success('Coupon created successfully');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const newStatus = !coupon.isActive;
      await axios.put(`/coupons/${coupon._id}`, { ...coupon, isActive: newStatus });
      toast.success(`Coupon ${coupon.code} is now ${newStatus ? 'Active' : 'Inactive'}`);
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleGlobalToggle = async (newStatus) => {
    setGlobalToggling(true);
    try {
      const updatePromises = coupons.map(coupon =>
        axios.put(`/coupons/${coupon._id}`, { ...coupon, isActive: newStatus })
      );
      await Promise.all(updatePromises);
      toast.success(`All coupons ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to update coupons');
    } finally {
      setGlobalToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1400px] mx-auto">
      <div className="space-y-6 md:space-y-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6">
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-2xl md:text-4xl font-serif text-brown font-black flex items-center gap-3 tracking-tight">
              <Ticket className="w-8 h-8 md:w-10 md:h-10 text-caramel" />
              Coupons
            </h1>
            <p className="text-muted text-xs md:text-sm font-medium ">Manage your bakery's promotional strategies</p>
          </div>

          <Button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-brown hover:bg-[#5a3828] text-white rounded-xl md:rounded-[1.5rem] px-8 h-12 md:h-14 gap-3 shadow-warm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">New Coupon</span>
          </Button>
        </header>

        {/* Global Control Section */}
        <div className="bg-gradient-to-r from-sage/10 to-caramel/10 rounded-2xl md:rounded-[2rem] p-4 md:p-6 border-2 border-sage/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
            <div className="space-y-1 md:space-y-2">
              <h3 className="text-base md:text-lg font-bold text-brown flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sage" />
                Global Controls
              </h3>
              <p className="text-[10px] md:text-sm text-muted ">Bulk manage activation for all coupons</p>
            </div>
            <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto">
              <Button
                onClick={() => handleGlobalToggle(true)}
                disabled={globalToggling}
                className="flex-1 lg:flex-none bg-sage hover:bg-sage/80 text-white rounded-xl px-4 md:px-6 h-11 md:h-12 font-bold flex items-center gap-2 transition-all"
              >
                {globalToggling ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                Activate All
              </Button>
              <Button
                onClick={() => handleGlobalToggle(false)}
                disabled={globalToggling}
                className="flex-1 lg:flex-none bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 md:px-6 h-11 md:h-12 font-bold flex items-center gap-2 transition-all"
              >
                {globalToggling ? <Loader2 className="animate-spin w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                Deactivate All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-soft border border-brown/5 flex flex-col sm:flex-row items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-brown/5 flex items-center justify-center text-brown">
              <Ticket className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest">Total</p>
              <p className="text-lg md:text-2xl font-serif font-black text-brown">{coupons.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-soft border border-brown/5 flex flex-col sm:flex-row items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-sage/10 flex items-center justify-center text-sage">
              <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest">Active</p>
              <p className="text-lg md:text-2xl font-serif font-black text-brown">
                {coupons.filter(c => c.isActive && new Date(c.expiryDate) > new Date()).length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-soft border border-brown/5 flex flex-col sm:flex-row items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-caramel/10 flex items-center justify-center text-caramel">
              <Percent className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest">Highest</p>
              <p className="text-lg md:text-2xl font-serif font-black text-brown">
                {coupons.length > 0 ? Math.max(...coupons.map(c => c.discount)) : 0}%
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-soft border border-brown/5 flex flex-col sm:flex-row items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <XCircle className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest">Expired</p>
              <p className="text-lg md:text-2xl font-serif font-black text-brown">
                {coupons.filter(c => new Date(c.expiryDate) <= new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {coupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((coupon) => (
            <Card key={coupon._id} className="rounded-3xl border-none shadow-soft overflow-hidden bg-white group transition-all duration-500">
              <CardContent className="p-0">
                <div className="relative h-36 md:h-44 overflow-hidden">
                  {coupon.image ? (
                    <>
                      <img src={coupon.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brown to-[#5a3828]" />
                  )}

                  <div className="relative h-full z-10 p-5 md:p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${coupon.isActive ? 'bg-sage/60 text-white border border-white/30' : 'bg-red-500/60 text-white border border-white/30'
                          }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <div className="flex gap-1 md:gap-2">
                        <button onClick={() => handleOpenModal(coupon)} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} className="p-2 hover:bg-red-500/30 rounded-full text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-mono font-black tracking-tighter text-white drop-shadow-lg leading-none mb-1">
                        {coupon.code}
                      </h3>
                      <p className="text-caramel font-black text-lg md:text-xl drop-shadow-md">
                        {coupon.discount}% OFF
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-3 md:space-y-4 bg-cream-highlight/10">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar className="w-4 h-4" />
                      <span>Expires</span>
                    </div>
                    <span className="font-bold text-brown">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <DollarSign className="w-4 h-4" />
                      <span>Min. Buy</span>
                    </div>
                    <span className="font-bold text-brown">৳{coupon.minPurchase}</span>
                  </div>

                  <div className="pt-1 md:pt-2">
                    {new Date() > new Date(coupon.expiryDate) ? (
                      <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 p-2 rounded-xl">
                        <XCircle className="w-3 h-3" /> Expired
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sage text-[10px] font-bold uppercase tracking-widest bg-sage/10 p-2 rounded-xl">
                        <Clock className="w-3 h-3" /> {Math.ceil((new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} Days Left
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {coupons.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-brown/10 rounded-[3rem] text-muted">
              <Ticket className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-serif  text-sm">No coupons created yet.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(coupons.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={coupons.length}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent showCloseButton={false} className="bg-cream-highlight border-brown/5 rounded-2xl w-[95vw] sm:w-[90vw] md:max-w-4xl p-0 overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-gradient-to-r from-brown to-[#5a3828] px-5 py-4 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-caramel" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-lg md:text-xl font-serif text-white font-black leading-tight">
                    {editingCoupon ? 'Refine Coupon' : 'New Promotion'}
                  </h2>
                  <p className="text-[9px] text-caramel font-black uppercase tracking-widest opacity-90">Promotion Management</p>
                </div>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-6 h-6" />
                </Button>
              </DialogClose>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Code</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="E.G. BAKE2024"
                  className="rounded-xl border-brown/5 bg-white font-mono font-black text-lg h-12 md:h-14 px-5 focus-visible:ring-sage shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Discount %</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="15"
                  className="rounded-xl border-brown/5 bg-white h-12 md:h-14 text-lg font-black px-5 focus-visible:ring-sage shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Min. Purchase</label>
                <Input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  placeholder="1000"
                  className="rounded-xl border-brown/5 bg-white h-12 md:h-14 text-lg font-black px-5 focus-visible:ring-sage shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Expiry Date</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="rounded-xl border-brown/5 bg-white h-12 md:h-14 font-bold px-4 focus-visible:ring-sage shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="rounded-xl border-brown/5 bg-white h-12 md:h-14 px-5 text-xs  focus-visible:ring-sage shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Status</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`h-12 md:h-14 w-full rounded-xl border flex items-center justify-center gap-3 transition-all ${formData.isActive ? 'bg-sage/5 border-sage text-sage' : 'bg-red-50 border-red-200 text-red-500'
                    }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex gap-3 md:gap-5">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1 h-12 md:h-14 rounded-xl border-brown/10 font-bold uppercase tracking-widest text-[10px] text-muted">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="flex-[2] bg-brown hover:bg-[#5a3828] text-white rounded-xl h-12 md:h-14 font-bold text-base shadow-xl active:scale-95 transition-all"
              >
                {editingCoupon ? 'Update Coupon' : 'Activate Coupon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
