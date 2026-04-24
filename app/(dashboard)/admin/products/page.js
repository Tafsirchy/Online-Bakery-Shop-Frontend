'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Package, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Cakes', stock: '', description: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/products', formData);
      fetchProducts();
      setOpen(false);
      setFormData({ name: '', price: '', category: 'Cakes', stock: '', description: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete');
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
              <Button className="bg-sage hover:bg-brown-hover text-white rounded-xl px-6">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cream-highlight border-border-light rounded-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-brown">New Bakery Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl border-border-light"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input 
                      required type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="rounded-xl border-border-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input 
                      required type="number" 
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="rounded-xl border-border-light"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="rounded-xl border-border-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-cream-highlight border-border-light">
                      <SelectItem value="Cakes">Cakes</SelectItem>
                      <SelectItem value="Pastries">Pastries</SelectItem>
                      <SelectItem value="Cookies">Cookies</SelectItem>
                      <SelectItem value="Bread">Bread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    required 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="rounded-xl border-border-light"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-6 rounded-xl bg-sage hover:bg-brown-hover transition-all"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Create Product'}
                </Button>
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
                  <TableHead className="font-bold text-brown">Product</TableHead>
                  <TableHead className="font-bold text-brown">Category</TableHead>
                  <TableHead className="font-bold text-brown">Price</TableHead>
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
                    <TableCell className="font-bold text-caramel">${product.price}</TableCell>
                    <TableCell>{product.stock} units</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-muted hover:text-sage">
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
