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
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-serif text-brown font-bold">Manage Products</h1>
            <p className="text-muted text-xs md:text-sm">Total inventory: {products.length} types of treats</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-sage hover:bg-brown-hover text-white rounded-xl md:rounded-full h-12 px-6 py-2 font-bold shadow-md flex items-center justify-center gap-3" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-1" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-cream-highlight border-brown/5 rounded-2xl w-[95vw] sm:w-[90vw] md:max-w-4xl p-0 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-brown to-[#5a3828] px-5 py-4 text-white border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-caramel" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-lg md:text-xl font-serif text-white font-extrabold leading-tight tracking-[0.01em]">
                        {editingId ? 'Refine Item' : 'New Creation'}
                      </h2>
                      <p className="text-[10px] text-caramel/95 uppercase tracking-[0.2em] font-bold">Product Management</p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      <X className="w-6 h-6" />
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 bg-white/30 backdrop-blur-sm overflow-y-auto max-h-[80vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-start">
                  {/* Left Column: Basic Details */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Product Name</Label>
                        <Input 
                        required 
                        placeholder="e.g., Chocolate Lava Cake"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Base Price (৳)</Label>
                        <Input 
                          required type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Offer Price (৳)</Label>
                        <Input 
                          type="number" 
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                          className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Stock Level</Label>
                        <Input 
                          required type="number" 
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(val) => setFormData({...formData, category: val})}
                        >
                          <SelectTrigger className="h-11 rounded-xl border-brown/5 bg-white focus:ring-sage">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-cream-highlight border-brown/5 rounded-xl z-50">
                            {categories.map((cat) => (
                              <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-brown/5 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                          className="h-6 w-6 rounded-md border-brown/10 text-sage focus:ring-sage transition-all"
                        />
                        <Label htmlFor="isFeatured" className="cursor-pointer font-bold text-brown text-sm">Feature on Homepage</Label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Assets & Descriptions */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Image URLs (comma separated)</Label>
                      <Input 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage"
                        placeholder="https://image1.jpg, https://image2.jpg"
                      />
                      {imageCandidates.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 custom-scrollbar">
                          {imageCandidates.map((src, idx) => (
                            <button
                              key={`${src}-${idx}`}
                              type="button"
                              onClick={() => setActiveImageIndex(idx)}
                              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                                idx === activeImageIndex ? 'border-sage ring-2 ring-sage/20 shadow-md' : 'border-brown/5 opacity-60'
                              }`}
                            >
                              <img src={src} alt="" className="object-cover w-full h-full" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Description</Label>
                      <Textarea 
                        required 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="rounded-xl border-brown/5 bg-white focus-visible:ring-sage h-24 md:h-32 resize-none text-sm"
                        placeholder="Tell the story of this treat..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Ingredients</Label>
                        <Textarea 
                          value={formData.ingredients}
                          onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                          className="rounded-xl border-brown/5 bg-white focus-visible:ring-sage h-20 text-xs"
                          placeholder="List key ingredients..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Health Benefits</Label>
                        <Textarea 
                          value={formData.healthBenefits}
                          onChange={(e) => setFormData({...formData, healthBenefits: e.target.value})}
                          className="rounded-xl border-brown/5 bg-white focus-visible:ring-sage h-20 text-xs"
                          placeholder="Nutritional benefits..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brown/5">
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-xl bg-sage hover:bg-brown text-white font-bold text-lg shadow-xl border-none transition-all active:scale-[0.98] flex gap-3 items-center justify-center"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
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
        <div className="bg-gradient-to-r from-caramel/10 to-sage/10 rounded-2xl p-5 md:p-6 border border-caramel/20">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-caramel" />
            <h3 className="text-base md:text-lg font-bold text-brown">Global Offer Management</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70 mb-2 block">Category</Label>
              <Select value={offerCategory} onValueChange={setOfferCategory}>
                <SelectTrigger className="h-12 rounded-xl border-brown/10 bg-white hover:border-caramel/50 transition-all shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-brown/10 rounded-xl shadow-lg z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70 mb-2 block">Discount %</Label>
              <Input
                type="number"
                min="1"
                max="99"
                value={globalOffer}
                onChange={(e) => setGlobalOffer(e.target.value)}
                placeholder="e.g., 20"
                className="h-12 rounded-xl border-brown/10 bg-white"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGlobalOffer}
                disabled={bulkOfferLoading}
                className="w-full bg-caramel hover:bg-brown text-white font-bold rounded-xl h-12 flex gap-2 items-center justify-center border-none shadow-md active:scale-95 transition-transform"
              >
                {bulkOfferLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Percent className="w-4 h-4" />}
                Apply Offer
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleClearGlobalOffer}
                disabled={bulkOfferLoading}
                className="w-full bg-white hover:bg-red-50 text-red-500 font-bold rounded-xl h-12 border-2 border-red-500/20 active:scale-95 transition-transform"
              >
                {bulkOfferLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Clear Offers'}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-cream-highlight rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Card View (Visible only on SM/MD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                <div key={product._id} className="bg-white rounded-2xl p-4 border border-brown/5 shadow-soft space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-brown/5">
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-brown font-bold truncate">{product.name}</h4>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{product.category}</p>
                      <p className="text-caramel font-bold">৳{Number(product.price).toFixed(0)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-brown/5">
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        product.stock > 0 ? 'bg-sage/10 text-sage' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {product.stock} units
                      </span>
                      {product.isFeatured && (
                        <span className="px-2 py-0.5 bg-caramel/10 text-caramel rounded text-[8px] font-bold uppercase tracking-wider">Featured</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted hover:text-sage hover:bg-sage/5"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl text-muted hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible only on LG+) */}
            <div className="hidden lg:block bg-white rounded-2xl md:rounded-3xl border border-brown/5 shadow-soft overflow-hidden">
              <Table>
                <TableHeader className="bg-cream-highlight/50">
                  <TableRow className="border-brown/5">
                    <TableHead className="font-bold text-brown">Product</TableHead>
                    <TableHead className="font-bold text-brown">Category</TableHead>
                    <TableHead className="font-bold text-brown">Price</TableHead>
                    <TableHead className="font-bold text-brown">Status</TableHead>
                    <TableHead className="font-bold text-brown">Offer</TableHead>
                    <TableHead className="font-bold text-brown">Stock</TableHead>
                    <TableHead className="text-right font-bold text-brown px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                    <TableRow key={product._id} className="hover:bg-brown/[0.01] border-brown/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-brown/5"
                          />
                          <span className="font-serif text-brown font-bold">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-cream-highlight border border-brown/10 rounded-full text-[10px] font-bold text-muted uppercase tracking-widest">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-caramel">৳{Number(product.price).toFixed(2)}</TableCell>
                      <TableCell>
                        {product.isFeatured ? (
                          <span className="px-2 py-0.5 bg-caramel/10 text-caramel rounded text-[10px] font-bold uppercase tracking-wider">Featured</span>
                        ) : (
                          <span className="text-muted text-[10px] font-bold opacity-30">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {Number(product.discountPrice) > 0 ? (
                          <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-bold">
                            ৳{Number(product.discountPrice).toFixed(0)}
                          </span>
                        ) : (
                          <span className="text-muted text-xs opacity-50">No offer</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{product.stock} units</TableCell>
                      <TableCell className="text-right space-x-2 px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-muted hover:text-sage hover:bg-sage/10"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-muted hover:text-red-500 hover:bg-red-50"
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
          </>
        )}

        <div className="pt-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={products.length}
          />
        </div>
      </div>
    </div>
  );
}
