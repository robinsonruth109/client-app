'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  platform: string;
  vipLevel: number;
  isActive: boolean;
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    price: '',
    platform: 'Amazon',
    vipLevel: '1',
    isActive: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [target.name]:
        target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.post('/products', {
        name: form.name,
        imageUrl: form.imageUrl,
        price: Number(form.price),
        platform: form.platform,
        vipLevel: Number(form.vipLevel),
        isActive: form.isActive,
      });

      setForm({
        name: '',
        imageUrl: '',
        price: '',
        platform: 'Amazon',
        vipLevel: '1',
        isActive: true,
      });

      await fetchProducts();
      alert('Product created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      setUpdatingId(product.id);

      await api.patch(`/products/${product.id}`, {
        isActive: !product.isActive,
      });

      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Failed to update product');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteProduct = async (productId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    );

    if (!confirmed) return;

    try {
      setUpdatingId(productId);

      await api.delete(`/products/${productId}`);
      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Failed to delete product');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <p className="text-sm text-gray-500">
          Add and manage products used for generated orders
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Add New Product</h2>

        <form
          onSubmit={handleCreateProduct}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Amazon Headphone"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="100"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="Amazon">Amazon</option>
              <option value="Alibaba">Alibaba</option>
              <option value="Aliexpress">Aliexpress</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              VIP Level
            </label>
            <select
              name="vipLevel"
              value={form.vipLevel}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="1">VIP 1</option>
              <option value="2">VIP 2</option>
              <option value="3">VIP 3</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3 text-gray-800">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Active product</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
            >
              {saving ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Product List</h2>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm text-gray-800">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Platform</th>
                  <th>VIP</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3">{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      <a
                        href={product.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Image
                      </a>
                    </td>
                    <td>{product.price}</td>
                    <td>{product.platform}</td>
                    <td>VIP {product.vipLevel}</td>
                    <td>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          product.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleProductStatus(product)}
                          disabled={updatingId === product.id}
                          className={`rounded px-3 py-1 text-sm ${
                            product.isActive
                              ? 'bg-yellow-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {product.isActive ? 'Disable' : 'Enable'}
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={updatingId === product.id}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}