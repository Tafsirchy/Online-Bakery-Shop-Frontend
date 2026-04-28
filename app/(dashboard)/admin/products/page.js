'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, CheckCircle2, ImageOff, X, Percent, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import Pagination from '@/components/shared/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [globalOffer, setGlobalOffer] = useState('');
  const [offerCategory, setOfferCategory] = useState('Cakes');
  const [bulkOfferLoading, setBulkOfferLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    category: 'Cakes',
    stock: '',
    description: '',
    imageUrl: '',
    isFeatured: false,
    ingredients: '',
    healthBenefits: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      discountPrice: '',
      category: 'Cakes',
      stock: '',
      description: '',
      imageUrl: '',
      isFeatured: false,
      ingredients: '',
      healthBenefits: '',
    });
    setEditingId(null);
    setActiveImageIndex(0);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products?limit=1000');
      setProducts(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data.data);
      if (response.data.data.length > 0) {
        setOfferCategory(response.data.data[0].name);
        setFormData(prev => ({ ...prev, category: response.data.data[0].name }));
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice > 0 ? product.discountPrice : '',
      category: product.category || 'Cakes',
      stock: product.stock ?? '',
      description: product.description || '',
      imageUrl: product.images?.join(', ') || '',
      isFeatured: product.isFeatured || false,
      ingredients: product.ingredients?.join(', ') || '',
      healthBenefits: product.healthBenefits?.join(', ') || '',
    });
    setActiveImageIndex(0);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const rawImages = formData.imageUrl.split(',').map(s => s.trim()).filter(Boolean);
      const images = Array.from(rawImages);
      // Move the selected active image to be first (primary)
      if (activeImageIndex > 0 && activeImageIndex < images.length) {
        const [primary] = images.splice(activeImageIndex, 1);
        images.unshift(primary);
      }

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        discountPrice: formData.discountPrice === '' ? 0 : Number(formData.discountPrice),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description.trim(),
        images,
        isFeatured: formData.isFeatured,
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        healthBenefits: formData.healthBenefits.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await axios.put(`/products/${editingId}`, payload);
      } else {
        await axios.post('/products', payload);
      }

      await fetchProducts();
      setOpen(false);
      resetForm();
      toast.success(editingId ? 'Product updated successfully' : 'Product created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/products/${id}`);
      await fetchProducts();
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleGlobalOffer = async () => {
    const percent = Number(globalOffer);
    if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
      alert('Please enter a valid offer percent between 1 and 99.');
      return;
    }

    setBulkOfferLoading(true);
    try {
      await axios.patch('/products/offers/global', {
        discountPercent: percent,
        category: offerCategory,
      });
      await fetchProducts();
      setGlobalOffer('');
      toast.success(`Global offer of ${percent}% applied to ${offerCategory} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply offer');
    } finally {
      setBulkOfferLoading(false);
    }
  };

  const handleClearGlobalOffer = async () => {
    setBulkOfferLoading(true);
    try {
      await axios.patch('/products/offers/global', {
        clear: true,
        category: offerCategory,
      });
      await fetchProducts();
      toast.success(`Global offers cleared for ${offerCategory}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear offer');
    } finally {
      setBulkOfferLoading(false);
    }
  };

  const imageCandidates = formData.imageUrl
    .split(',')
    .map((src) => src.trim())
    .filter(Boolean);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-brown font-bold">Manage Products</h1>
            <p className="text-muted">Total inventory: {products.length} types of treats</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-brown-hover text-white rounded-full h-12 px-6 py-2 font-bold shadow-md flex items-center gap-3" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-1" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-cream-highlight border-border-light rounded-lg !max-w-[920px] w-[80vw] p-0 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-brown to-[#5a3828] px-4 py-3 text-white border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-caramel" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-[18px] font-serif text-white font-extrabold leading-tight tracking-[0.01em]">
                        {editingId ? 'Refine Bakery Item' : 'New Bakery Creation'}
                      </h2>
                      <p className="text-[10px] text-caramel/95 uppercase tracking-[0.2em] font-bold">Product Management System</p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-2.5 space-y-2.5 bg-white/30 backdrop-blur-sm overflow-visible">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                  {/* Left Column: Basic Details */}
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Product Name</Label>
                        <Input 
                        required 
                        placeholder="e.g., Chocolate Lava Cake"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white transition-all h-8 shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Base Price (৳)</Label>
                        <Input 
                          required type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="rounded-lg border-border-light bg-white/50 focus:bg-white h-8 shadow-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Offer Price (৳)</Label>
                        <Input 
                          type="number" 
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                          className="rounded-lg border-border-light bg-white/50 focus:bg-white h-8 shadow-sm"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-3">
                          <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Inventory Stock</Label>
                          <Input 
                            required type="number" 
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            className="rounded-lg border-border-light bg-white/50 focus:bg-white h-8 shadow-sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Category</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(val) => setFormData({...formData, category: val})}
                          >
                            <SelectTrigger className="rounded-lg border-border-light bg-white/50 focus:bg-white h-8 shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                            <SelectContent className="bg-cream-highlight border-border-light rounded-lg z-50">
                              {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center space-x-3 p-1.5 bg-white/40 rounded-lg border border-border-light">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                          className="h-5 w-5 rounded-lg border-border-light text-sage focus:ring-sage transition-all"
                        />
                        <Label htmlFor="isFeatured" className="cursor-pointer font-bold text-brown">Feature on Home Page</Label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Descriptions & Assets */}
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Image Assets (URLs, comma-separated)</Label>
                      <Input 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white h-8 shadow-sm"
                        placeholder="https://image1.jpg, https://image2.jpg"
                      />
                      {imageCandidates.length > 1 && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {imageCandidates.map((src, idx) => (
                          <button
                            key={`${src}-${idx}`}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-14 h-14 rounded-lg overflow-hidden border ${idx === activeImageIndex ? 'ring-2 ring-sage' : 'border-border-light'} bg-white flex items-center justify-center`}
                          >
                            <img
                              src={src}
                              alt=""
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) {
                                  fallback.classList.remove('hidden');
                                }
                              }}
                            />
                            <span className="hidden absolute inset-0 flex items-center justify-center text-muted">
                              <ImageOff className="w-4 h-4" />
                            </span>
                          </button>
                        ))}
                      </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Detailed Description</Label>
                      <Textarea 
                        required 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white h-18 shadow-sm resize-none"
                        placeholder="Tell us about the texture, flavor, and story of this treat..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Ingredients</Label>
                        <Textarea 
                          value={formData.ingredients}
                          onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                          className="rounded-lg border-border-light bg-white/50 focus:bg-white h-14 shadow-sm text-xs"
                          placeholder="Flour, Sugar, Cocoa..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Health Benefits</Label>
                        <Textarea 
                          value={formData.healthBenefits}
                          onChange={(e) => setFormData({...formData, healthBenefits: e.target.value})}
                          className="rounded-lg border-border-light bg-white/50 focus:bg-white h-14 shadow-sm text-xs"
                          placeholder="Rich in antioxidants..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-light">
                  <Button 
                    type="submit" 
                    className="w-full py-1.5 rounded-lg bg-sage hover:bg-brown text-white font-bold text-sm shadow-xl transition-all active:scale-[0.99] flex gap-3 items-center justify-center"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {editingId ? 'Save Changes' : 'Create Product'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {/* Global Offer Management Section */}
        <div className="bg-gradient-to-r from-caramel/10 to-sage/10 rounded-2xl p-6 border border-caramel/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-caramel" />
            <h3 className="text-lg font-bold text-brown">Global Offer Management</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70 mb-2 block">Select Category</Label>
              <Select value={offerCategory} onValueChange={setOfferCategory}>
                <SelectTrigger className="rounded-lg border-2 border-caramel/30 bg-gradient-to-r from-cream-highlight to-white h-10 hover:bg-white hover:border-caramel/50 transition-all shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-b from-cream-highlight to-white border-2 border-caramel/20 rounded-lg shadow-lg">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name} className="hover:bg-caramel/10 cursor-pointer">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70 mb-2 block">Offer Percent (1-99)</Label>
              <Input
                type="number"
                min="1"
                max="99"
                value={globalOffer}
                onChange={(e) => setGlobalOffer(e.target.value)}
                placeholder="e.g., 20"
                className="rounded-lg border-border-light bg-white h-10"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGlobalOffer}
                disabled={bulkOfferLoading}
                className="w-full bg-caramel hover:bg-brown text-white font-bold rounded-lg h-10 flex gap-2 items-center justify-center"
              >
                {bulkOfferLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Percent className="w-4 h-4" />}
                Apply Offer
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleClearGlobalOffer}
                disabled={bulkOfferLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg h-10"
              >
                {bulkOfferLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Clear Offers'}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 bg-cream-highlight rounded-3xl animate-pulse" />
        ) : (
          <div className="bg-white rounded-3xl border border-border-light shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-cream-highlight">
                <TableRow>
                  <TableHead className="font-bold text-brown">Product</TableHead>
                  <TableHead className="font-bold text-brown">Category</TableHead>
                  <TableHead className="font-bold text-brown">Price</TableHead>
                  <TableHead className="font-bold text-brown">Featured</TableHead>
                  <TableHead className="font-bold text-brown">Offer</TableHead>
                  <TableHead className="font-bold text-brown">Stock</TableHead>
                  <TableHead className="text-right font-bold text-brown">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                  <TableRow key={product._id} className="hover:bg-brown/[0.02] border-border-light/40 transition-colors">
                    <TableCell className="font-medium font-serif text-brown">{product.name}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-cream-highlight border border-border-light rounded-full text-xs text-muted">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-caramel">৳{Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      {product.isFeatured ? (
                        <span className="px-2 py-0.5 bg-caramel/10 text-caramel rounded text-[10px] font-bold uppercase tracking-wider">Featured</span>
                      ) : (
                        <span className="text-muted text-[10px]">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {Number(product.discountPrice) > 0 ? (
                        <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-semibold">
                          ৳{Number(product.discountPrice).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">No offer</span>
                      )}
                    </TableCell>
                    <TableCell>{product.stock} units</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted hover:text-sage"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted hover:text-red-500"
                        onClick={() => handleDelete(product._id)}
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

        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(products.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={products.length}
        />
      </div>
    </div>
  );
}
