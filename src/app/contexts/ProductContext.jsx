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
        const resProducts = await fetch('http://localhost:9999/products');
        const dataProducts = await resProducts.json();
        
        // Gọi dữ liệu danh mục
        const resCategories = await fetch('http://localhost:9999/categories');
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

  // Truyền thêm loading ra ngoài để các trang biết lúc nào dữ liệu tải xong
  const value = { products, setProducts, categories, getProduct, loading };
  
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