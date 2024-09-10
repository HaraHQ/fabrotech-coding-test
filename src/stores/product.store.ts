import { create } from "zustand";

type Dimensions = {
  depth: number;
  width: number;
  height: number;
};

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  revieverEmail: string;
};

type ProductMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
};

export type Fields =
  | "id"
  | "title"
  | "description"
  | "category"
  | "price"
  | "discountPercentage"
  | "rating"
  | "stock"
  | "tags"
  | "brand"
  | "sku"
  | "weight"
  | "dimensions"
  | "warrantyInformation"
  | "shippingInformation"
  | "availabilityStatus"
  | "reviews"
  | "returnPolicy"
  | "minimumOrderQuantity"
  | "meta"
  | "thumbnail"
  | "images";

type SortBy = {
  field: Fields;
  order: "asc" | "desc";
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};

interface ProductStore {
  ready: boolean;
  limit: number;
  page: number;
  sortBy: SortBy;
  data: Product[];
  field: Fields[];
  details: Product | null;
  categories: Category[];
  selectedCategory: string | null;
  getProducts: (category: string | null) => Promise<void>;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  setSortBy: (field: Fields, order: "asc" | "desc") => void;
  getProductById: (id: number) => Promise<void>;
  clearDetail: () => void;
  getCategories: () => Promise<void>;
  setCategory: (category: string) => void;
  clearCategory: () => void;
}

const ProductStoreHook = create<ProductStore>((set, get) => ({
  ready: false,
  limit: 10,
  page: 1,
  sortBy: { field: "id", order: "asc" },
  data: [],
  field: ["thumbnail", "title", "description", "price"],
  details: null,
  categories: [],
  selectedCategory: null,
  getProducts: async (category) => {
    const { field, limit, page } = get();
    const urlDefault = `https://dummyjson.com/products?select=${field.join(
      ","
    )}&limit=${limit}&skip=${page > 1 ? (page - 1) * limit : 0}&sortBy=${
      get().sortBy.field
    }&order=${get().sortBy.order}`;

    const urlCategory = `https://dummyjson.com/products/category/${
      category
    }?select=${field.join(",")}&limit=${limit}&skip=${
      page > 1 ? (page - 1) * limit : 0
    }&sortBy=${get().sortBy.field}&order=${get().sortBy.order}`;

    const response = await fetch(category ? urlCategory : urlDefault);
    const data = await response.json();
    set({ data: data.products || [], ready: true });
  },
  setLimit: (limit) => set({ limit }),
  setPage: (page) => set({ page }),
  setSortBy: (field, order) => set({ sortBy: { field, order } }),
  getProductById: async (id) => {
    const response = await fetch(
      `https://dummyjson.com/products/${id}?select=title,description,price,availabilityStatus,images`
    );
    const data = await response.json();
    set({ details: data });
  },
  clearDetail: () => set({ details: null }),
  getCategories: async () => {
    const response = await fetch("https://dummyjson.com/products/categories");
    const data = await response.json();
    set({ categories: data });
  },
  setCategory: (category) => set({ selectedCategory: category || null }),
  clearCategory: () => set({ selectedCategory: null }),
}));

export default ProductStoreHook;
