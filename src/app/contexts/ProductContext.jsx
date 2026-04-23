import { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // Thêm state loading để lúc dữ liệu đang tải, web không bị giật hoặc lỗi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm gọi API từ json-server
    const fetchFivePigsData = async () => {
      try {
        setLoading(true);
        // Gọi dữ liệu sản phẩm
        const resProducts = await fetch('http://localhost:3001/products');
        const dataProducts = await resProducts.json();
        
        // Gọi dữ liệu danh mục
        const resCategories = await fetch('http://localhost:3001/categories');
        const dataCategories = await resCategories.json();

        // Cập nhật vào kho chứa chung
        setProducts(dataProducts);
        setCategories(dataCategories);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ database.json:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFivePigsData();
  }, []);

  // Giữ nguyên hàm này để trang ProductDetail vẫn tìm được sản phẩm
  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  // 1. Hàm lấy danh sách đánh giá theo ID sản phẩm
  const getReviewsByProductId = async (productId) => {
    try {
      // Ép kiểu productId sang String để khớp với database của bạn
      const res = await fetch(`http://localhost:3001/reviews?productId=${String(productId)}`);
      return await res.json();
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      return []; // Nếu lỗi, trả về mảng rỗng để web không bị crash
    }
  };

  // 2. Hàm thêm một đánh giá mới vào database
  const addReview = async (newReview) => {
    try {
      const res = await fetch(`http://localhost:3001/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview)
      });
      return await res.json(); // json-server sẽ tự động thêm 'id' và trả về object vừa tạo
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      return null;
    }
  };

  // 3. Admin: Thêm sản phẩm mới
  const addProduct = async (productData) => {
    try {
      const res = await fetch(`http://localhost:3001/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error("Lỗi khi thêm sản phẩm");
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 4. Admin: Cập nhật sản phẩm
  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật sản phẩm");
      const updatedProduct = await res.json();
      setProducts(prev => prev.map(p => String(p.id) === String(id) ? updatedProduct : p));
      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 5. Admin: Xóa sản phẩm
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/products/${encodeURIComponent(String(id))}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  };

  // 6. Admin: Thêm danh mục
  const addCategory = async (categoryName) => {
    try {
      const newCat = { name: categoryName, id: String(Date.now()) };
      const res = await fetch(`http://localhost:3001/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      if (!res.ok) throw new Error("Lỗi khi thêm danh mục");
      const savedCat = await res.json();
      setCategories(prev => [...prev, savedCat]);
      return savedCat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 7. Admin: Xóa danh mục
  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/categories/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Lỗi khi xóa danh mục");
      setCategories(prev => prev.filter(c => String(c.id) !== String(id)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Truyền thêm hàm mới vào value
  const value = {
    products,
    setProducts,
    categories,
    getProduct,
    loading,
    getReviewsByProductId,
    addReview,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory
  };
  
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// Giữ nguyên custom hook của bạn
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
}