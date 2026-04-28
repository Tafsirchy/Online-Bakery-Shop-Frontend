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
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-brown font-bold">Manage Collections</h1>
            <p className="text-muted">Total collections: {categories.length}</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-brown-hover text-white rounded-full h-12 px-6 py-2 font-bold shadow-md flex items-center gap-3" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-1" />
                Add New Collection
              </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-cream-highlight border-border-light rounded-lg !max-w-[920px] w-[90vw] p-0 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-brown to-[#5a3828] px-4 py-3 text-white border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-caramel" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-[18px] font-serif text-white font-extrabold leading-tight tracking-[0.01em]">
                        {editingId ? 'Refine Collection' : 'New Collection'}
                      </h2>
                      <p className="text-[10px] text-caramel/95 uppercase tracking-[0.2em] font-bold">Collection Management System</p>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-white/30 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Collection Name</Label>
                      <Input 
                        required 
                        placeholder="e.g., Seasonal Specials"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white h-10 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Image URL</Label>
                      <Input 
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white h-10 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Subtitle</Label>
                      <Input 
                        placeholder="e.g., Artisanal Treats"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white h-10 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-brown opacity-70">Description</Label>
                      <Textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="rounded-lg border-border-light bg-white/50 focus:bg-white h-32 shadow-sm resize-none"
                        placeholder="A brief description of this collection..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-2.5 bg-white/40 rounded-lg border border-border-light">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          className="h-5 w-5 rounded border-border-light text-sage focus:ring-sage"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer font-bold text-brown text-sm">Active</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-2.5 bg-white/40 rounded-lg border border-border-light">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                          className="h-5 w-5 rounded border-border-light text-caramel focus:ring-caramel"
                        />
                        <Label htmlFor="isFeatured" className="cursor-pointer font-bold text-brown text-sm">Featured</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-light">
                  <Button 
                    type="submit" 
                    className="w-full py-3 rounded-lg bg-sage hover:bg-brown text-white font-bold text-base shadow-xl transition-all flex gap-3 items-center justify-center"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
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
          <div className="h-64 bg-cream-highlight rounded-3xl animate-pulse" />
        ) : (
          <div className="bg-white rounded-3xl border border-border-light shadow-soft overflow-hidden">
            <Table>
              <TableHeader className="bg-cream-highlight">
                <TableRow>
                  <TableHead className="font-bold text-brown">Collection</TableHead>
                  <TableHead className="font-bold text-brown">Description</TableHead>
                  <TableHead className="font-bold text-brown">Status</TableHead>
                  <TableHead className="font-bold text-brown">Featured</TableHead>
                  <TableHead className="text-right font-bold text-brown">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((category) => (
                  <TableRow key={category._id} className="hover:bg-brown/[0.02] border-border-light/40 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img src={category.image} className="w-10 h-10 rounded-lg object-cover border border-border-light" alt="" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-cream-highlight border border-border-light flex items-center justify-center">
                            <Layers className="w-5 h-5 text-caramel/40" />
                          </div>
                        )}
                        <span className="font-serif text-brown font-bold">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted line-clamp-1">{category.description || '-'}</p>
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
                        <span className="text-muted text-[10px]">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted hover:text-sage"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted hover:text-red-500"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(categories.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={categories.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
