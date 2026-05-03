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
import {
  Plus,
  Layers,
  X,
  Loader2,
  CheckCircle2,
  Pencil,
  Trash2,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '@/components/shared/Pagination';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subtitle: '',
    image: '',
    isActive: true,
    isFeatured: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subtitle: '',
      image: '',
      isActive: true,
      isFeatured: false
    });
    setEditingId(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories/admin');
      setCategories(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      subtitle: category.subtitle || '',
      image: category.image || '',
      isActive: category.isActive ?? true,
      isFeatured: category.isFeatured ?? false
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await axios.put(`/categories/${editingId}`, formData);
        toast.success('Category updated successfully');
      } else {
        await axios.post('/categories', formData);
        toast.success('Category created successfully');
      }

      await fetchCategories();
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if products are still assigned to it.')) return;

    try {
      await axios.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      await fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-serif text-brown font-bold">Manage Collections</h1>
            <p className="text-muted text-xs md:text-sm">Total collections: {categories.length}</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-sage hover:bg-brown-hover text-white rounded-xl md:rounded-full h-12 px-6 py-2 font-bold shadow-md flex items-center justify-center gap-3" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-1" />
                Add New Collection
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-cream-highlight border-brown/5 rounded-2xl w-[95vw] sm:w-[90vw] md:max-w-4xl p-0 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-brown to-[#5a3828] px-5 py-4 text-white border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-caramel" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-lg md:text-xl font-serif text-white font-extrabold leading-tight tracking-[0.01em]">
                        {editingId ? 'Refine Collection' : 'New Collection'}
                      </h2>
                      <p className="text-[10px] text-caramel/95 uppercase tracking-[0.2em] font-bold">Collection Management</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Collection Name</Label>
                      <Input
                        required
                        placeholder="e.g., Seasonal Specials"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Image URL</Label>
                      <Input
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Subtitle</Label>
                      <Input
                        placeholder="e.g., Artisanal Treats"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="h-11 rounded-xl border-brown/5 bg-white focus-visible:ring-sage shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-brown opacity-70">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="rounded-xl border-brown/5 bg-white focus-visible:ring-sage h-24 md:h-32 shadow-sm resize-none text-sm"
                        placeholder="A brief description..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-brown/5 shadow-sm">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="h-6 w-6 rounded-md border-brown/10 text-sage focus:ring-sage transition-all"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer font-bold text-brown text-sm">Active</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-brown/5 shadow-sm">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="h-6 w-6 rounded-md border-brown/10 text-caramel focus:ring-caramel transition-all"
                        />
                        <Label htmlFor="isFeatured" className="cursor-pointer font-bold text-brown text-sm">Featured</Label>
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
                        {editingId ? 'Save Changes' : 'Create Collection'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-cream-highlight rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Card View (Visible only on SM/MD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((category) => (
                <div key={category._id} className="bg-white rounded-2xl p-4 border border-brown/5 shadow-soft space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-brown/5 bg-cream-highlight flex items-center justify-center">
                      {category.image ? (
                        <img src={category.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Layers className="w-6 h-6 text-caramel/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-brown font-bold truncate">{category.name}</h4>
                      <p className="text-xs text-muted line-clamp-1 ">{category.subtitle || 'No subtitle'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-brown/5">
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${category.isActive ? 'bg-sage/10 text-sage' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {category.isFeatured && (
                        <span className="px-2 py-0.5 bg-caramel/10 text-caramel rounded text-[8px] font-bold uppercase tracking-wider">Featured</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted hover:text-sage hover:bg-sage/5"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(category._id)}
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
                    <TableHead className="font-bold text-brown">Collection</TableHead>
                    <TableHead className="font-bold text-brown">Subtitle</TableHead>
                    <TableHead className="font-bold text-brown">Status</TableHead>
                    <TableHead className="font-bold text-brown">Featured</TableHead>
                    <TableHead className="text-right font-bold text-brown px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((category) => (
                    <TableRow key={category._id} className="hover:bg-brown/[0.01] border-brown/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-highlight flex items-center justify-center border border-brown/5">
                            {category.image ? (
                              <img src={category.image} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <Layers className="w-5 h-5 text-caramel/40" />
                            )}
                          </div>
                          <span className="font-serif text-brown font-bold">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted ">
                        {category.subtitle || '-'}
                      </TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <span className="px-2 py-0.5 bg-sage/10 text-sage rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-bold uppercase tracking-wider">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.isFeatured ? (
                          <span className="px-2 py-0.5 bg-caramel/10 text-caramel rounded text-[10px] font-bold uppercase tracking-wider">Featured</span>
                        ) : (
                          <span className="text-muted text-[10px] font-bold opacity-30">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2 px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-muted hover:text-sage hover:bg-sage/10"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-muted hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(category._id)}
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
                totalPages={Math.ceil(categories.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={categories.length}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
