import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ProductService } from '../services/ProductService';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getProducts(),
        ProductService.getCategories(),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Load products/categories failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProduct = (id) => {
    return products.find((p) => String(p.id) === String(id));
  };

  const addProduct = async (productData) => {
    const created = await ProductService.createProduct({
      ...productData,
      id: String(productData.id),
      rating: Number(productData.rating || 0),
      reviews: Number(productData.reviews || 0),
    });

    setProducts((prev) => [...prev, created]);
    return created;
  };

  const updateProduct = async (productId, productData) => {
    const updated = await ProductService.updateProduct(productId, {
      ...productData,
      id: String(productId),
      rating: Number(productData.rating || 0),
      reviews: Number(productData.reviews || 0),
    });

    setProducts((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId) ? updated : item
      )
    );

    return updated;
  };

  const deleteProduct = async (productId) => {
    await ProductService.deleteProduct(productId);
    setProducts((prev) =>
      prev.filter((item) => String(item.id) !== String(productId))
    );
  };

  const addCategory = async (categoryName) => {
    const existed = categories.some(
      (item) => item.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
    );

    if (existed) {
      throw new Error('Danh mục đã tồn tại');
    }

    const newCategory = {
      id: Date.now().toString(),
      name: categoryName.trim(),
    };

    const created = await ProductService.createCategory(newCategory);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const deleteCategory = async (categoryId) => {
    await ProductService.deleteCategory(categoryId);
    setCategories((prev) =>
      prev.filter((item) => String(item.id) !== String(categoryId))
    );
  };

  const categoryNames = useMemo(
    () => categories.map((item) => item.name),
    [categories]
  );

  const value = {
    loading,
    products,
    categories,
    categoryNames,
    getProduct,
    loadData,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return ctx;
}