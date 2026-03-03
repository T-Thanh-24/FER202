import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ProductContext = createContext();

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Basic T-Shirt',
    description: 'Áo thun cotton basic, dễ phối đồ.',
    price: 120000,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: 120
  },
  {
    id: '2',
    name: 'Hoodie',
    description: 'Hoodie ấm áp, phù hợp thời tiết se lạnh.',
    price: 250000,
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    stock: 30,
    image: "https://down-vn.img.susercontent.com/file/sg-11134201-7rdwf-md71q43uvm0s36",
    rating: 4.7,
    reviews: 86
  },
  {
    id: '3',
    name: 'Jeans',
    description: 'Quần jeans form đẹp, bền màu.',
    price: 300000,
    category: 'Jeans',
    sizes: ['30', '32', '34', '36'],
    stock: 40,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=60",
    rating: 4.3,
    reviews: 54
  },
  {
    id: '4',
    name: 'Jacket',
    description: 'Áo khoác thời trang, chống gió nhẹ.',
    price: 450000,
    category: 'Jackets',
    sizes: ['S', 'M', 'L'],
    stock: 20,
    image: "https://redtape.com/cdn/shop/files/RFJ1085A_1_bc32d4db-ecd6-43f7-88d0-5890f431b15b.jpg?v=1759992692",
    rating: 4.6,
    reviews: 32
  },
  {
    id: '5',
    name: 'Summer Dress',
    description: 'Đầm hoa mùa hè nhẹ nhàng, thoáng mát.',
    price: 799000,
    category: 'Dresses',
    sizes: ['S', 'M', 'L'],
    stock: 25,
    image: "https://www.ortuseo.com/cdn/shop/files/floral-summer-dress-womens-clothing-style-dresses-skirts-style-106.jpg?v=1723602334",
    rating: 4.6,
    reviews: 73
  },
  {
    id: '6',
    name: 'Polo Shirt',
    description: 'Áo polo lịch sự, dễ mặc đi học/đi làm.',
    price: 399000,
    category: 'Shirts',
    sizes: ['M', 'L', 'XL'],
    stock: 45,
    image: "https://i5.walmartimages.com/seo/U-S-Polo-Assn-Women-s-Interlock-Heather-Polo-Shirt_f15df835-9c1e-4524-8905-b8695c980c8e.beff3ba705bbb6f1d3414b480e60634e.jpeg",
    rating: 4.3,
    reviews: 64
  }
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fivepigs_products');
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(DEFAULT_PRODUCTS);
  }, []);

  useEffect(() => {
    if (products.length) {
      localStorage.setItem('fivepigs_products', JSON.stringify(products));
    }
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  const value = { products, setProducts, categories, getProduct };
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
}
