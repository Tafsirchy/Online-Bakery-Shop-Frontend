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
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Percent, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [globalOffer, setGlobalOffer] = useState('');
  const [offerCategory, setOfferCategory] = useState('all');
  const [bulkOfferLoading, setBulkOfferLoading] = useState(false);

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
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        discountPrice: formData.discountPrice === '' ? 0 : Number(formData.discountPrice),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description.trim(),
        images: formData.imageUrl.split(',').map(s => s.trim()).filter(Boolean),
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
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert('Failed to delete');
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
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply offer');
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
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear offer');
    } finally {
      setBulkOfferLoading(false);
    }
  };

  const handleProductOffer = async (product) => {
    const input = prompt('Enter offer percent (1-99). Leave blank to clear this product offer.');
    if (input === null) return;

    try {
      if (input.trim() === '') {
        await axios.patch(`/products/${product._id}/offer`, { clear: true });
      } else {
        const percent = Number(input);
        if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
          alert('Offer percent must be between 1 and 99.');
          return;
        }
        await axios.patch(`/products/${product._id}/offer`, { discountPercent: percent });
      }
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product offer');
    }
  };

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
              <Button className="bg-sage hover:bg-brown-hover text-white rounded-xl px-6" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream-highlight border-border-light rounded-[2.5rem] !max-w-[1200px] w-[95vw] p-0 overflow-hidden shadow-2xl">
              <div className="bg-brown p-7 text-white border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-caramel" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-white font-bold leading-none">
                      {editingId ? 'Refine Bakery Item' : 'New Bakery Creation'}
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2 font-bold">Product Management System</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] min-h-[400px] overflow-y-auto custom-scrollbar bg-white/30 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Basic Details */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Product Name</Label>
                      <Input 
                        required 
                        placeholder="e.g., Chocolate Lava Cake"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="rounded-2xl border-border-light bg-white/50 focus:bg-white transition-all h-12 shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Base Price ($)</Label>
                        <Input 
                          required type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-12 shadow-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Offer Price ($)</Label>
                        <Input 
                          type="number" 
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                          className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-12 shadow-sm"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Inventory Stock</Label>
                          <Input 
                            required type="number" 
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-12 shadow-sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Category</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(val) => setFormData({...formData, category: val})}
                          >
                            <SelectTrigger className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-12 shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-cream-highlight border-border-light rounded-xl">
                              <SelectItem value="Cakes">Cakes</SelectItem>
                              <SelectItem value="Pastries">Pastries</SelectItem>
                              <SelectItem value="Cookies">Cookies</SelectItem>
                              <SelectItem value="Bread">Bread</SelectItem>
                              <SelectItem value="Offers">Offers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-3 p-4 bg-white/40 rounded-2xl border border-border-light">
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
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Image Assets (URLs, comma-separated)</Label>
                      <Input 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-12 shadow-sm"
                        placeholder="https://image1.jpg, https://image2.jpg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Detailed Description</Label>
                      <Textarea 
                        required 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-32 shadow-sm resize-none"
                        placeholder="Tell us about the texture, flavor, and story of this treat..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Ingredients</Label>
                        <Textarea 
                          value={formData.ingredients}
                          onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                          className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-24 shadow-sm text-xs"
                          placeholder="Flour, Sugar, Cocoa..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Health Benefits</Label>
                        <Textarea 
                          value={formData.healthBenefits}
                          onChange={(e) => setFormData({...formData, healthBenefits: e.target.value})}
                          className="rounded-2xl border-border-light bg-white/50 focus:bg-white h-24 shadow-sm text-xs"
                          placeholder="Rich in antioxidants..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-light">
                  <Button 
                    type="submit" 
                    className="w-full py-6 rounded-[1.2rem] bg-sage hover:bg-brown text-white font-bold text-lg shadow-xl transition-all active:scale-[0.99] flex gap-3"
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

        <section className="bg-cream-highlight rounded-2xl border border-border-light p-4 md:p-6 space-y-4">
          <h2 className="text-xl font-serif text-brown flex items-center gap-2">
            <Percent className="w-5 h-5 text-caramel" />
            Product Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder="Global offer % (e.g. 15)"
                value={globalOffer}
                onChange={(e) => setGlobalOffer(e.target.value)}
                className="rounded-xl border-border-light"
              />
            </div>
            <Select value={offerCategory} onValueChange={setOfferCategory}>
              <SelectTrigger className="rounded-xl border-border-light bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cream-highlight border-border-light">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cakes">Cakes</SelectItem>
                <SelectItem value="Pastries">Pastries</SelectItem>
                <SelectItem value="Cookies">Cookies</SelectItem>
                <SelectItem value="Bread">Bread</SelectItem>
                <SelectItem value="Offers">Offers</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={handleGlobalOffer}
                disabled={bulkOfferLoading}
                className="flex-1 bg-sage hover:bg-brown-hover text-white rounded-xl"
              >
                Apply
              </Button>
              <Button
                onClick={handleClearGlobalOffer}
                disabled={bulkOfferLoading}
                variant="outline"
                className="flex-1 rounded-xl border-border-light"
              >
                Clear
              </Button>
            </div>
          </div>
        </section>

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
                {products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-sage/5 transition-colors">
                    <TableCell className="font-medium font-serif text-brown">{product.name}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-cream-highlight border border-border-light rounded-full text-xs text-muted">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-caramel">${Number(product.price).toFixed(2)}</TableCell>
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
                          ${Number(product.discountPrice).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">No offer</span>
                      )}
                    </TableCell>
                    <TableCell>{product.stock} units</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted hover:text-caramel"
                        onClick={() => handleProductOffer(product)}
                      >
                        Offer
                      </Button>
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
      </div>
    </div>
  );
}
