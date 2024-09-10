import Details from "@/components/details";
import Pagination from "@/components/pagination";
import ProductStoreHook, { Fields } from "@/stores/product.store";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Roboto } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { TiArrowSortedDown, TiArrowSortedUp, TiTimes } from "react-icons/ti";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function Home() {
  const products = ProductStoreHook();
  const categoryRef = useRef<HTMLSelectElement>(null);

  useQuery({
    queryKey: [
      "products",
      products.page,
      products.limit,
      products.sortBy.field,
      products.sortBy.order,
      products.selectedCategory,
    ],
    queryFn: async () => {
      if (products.selectedCategory) {
        await products.getProducts(products.selectedCategory);
      } else {
        await products.getProducts(null);
      }
      return true;
    },
    refetchOnWindowFocus: false,
  });

  const cats = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      await products.getCategories();
      return true;
    },
    refetchOnWindowFocus: false,
  })

  const sorter = (field: Fields) => {
    if (products.sortBy.field === field && products.sortBy.order === "asc") {
      return "desc";
    } else if (
      products.sortBy.field === field &&
      products.sortBy.order === "desc"
    ) {
      return "asc";
    } else {
      return "asc";
    }
  };

  const handleClearCategory = () => {
    if (categoryRef.current) {
      categoryRef.current.value = "";
      products.clearCategory();
    }
  }

  return (
    <div
      className={`${roboto.variable} font-[family-name:var(--font-roboto)] relative`}
    >
      <Head>
        <title>Fabrotech</title>
      </Head>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center">
          <div className="border border-black flex items-center gap-2">
            {cats.isLoading && <div>Loading categories</div>}
            {cats.isSuccess && !cats.isLoading && (
              <>
                <select
                  ref={categoryRef}
                  className="p-2 max-md:w-full"
                  onChange={(e) =>
                    products.setCategory(e.target.value)
                  }
                >
                  <option value={''}>All Category</option>
                  {products.categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <TiTimes className="text-lg cursor-pointer hover:text-red-500" onClick={handleClearCategory} />
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-7 border border-black">
          <div
            className="col-span-2 font-bold border-b border-black cursor-pointer hover:bg-neutral-200 p-2 flex items-center"
            onClick={() => products.setSortBy("title", sorter("title"))}
          >
            Product
            {products.sortBy.field === "title" &&
              (products.sortBy.order === "asc" ? (
                <TiArrowSortedDown />
              ) : (
                <TiArrowSortedUp />
              ))}
          </div>
          <div
            className="col-span-4 font-bold border-b border-black cursor-pointer hover:bg-neutral-200 p-2 flex items-center"
            onClick={() =>
              products.setSortBy("description", sorter("description"))
            }
          >
            Description
            {products.sortBy.field === "description" &&
              (products.sortBy.order === "asc" ? (
                <TiArrowSortedDown />
              ) : (
                <TiArrowSortedUp />
              ))}
          </div>
          <div
            className="font-bold border-b border-black cursor-pointer hover:bg-neutral-200 p-2 flex items-center"
            onClick={() => products.setSortBy("price", sorter("price"))}
          >
            Price
            {products.sortBy.field === "price" &&
              (products.sortBy.order === "asc" ? (
                <TiArrowSortedDown />
              ) : (
                <TiArrowSortedUp />
              ))}
          </div>
          {!products.ready && <div>Loading...</div>}
          {products.ready &&
            products.data.map((value) => (
              <Fragment key={value.id}>
                <div
                  className="flex items-center gap-1 max-md:col-span-7 col-span-2 p-2 cursor-pointer"
                  onClick={async () => await products.getProductById(value.id)}
                >
                  <Image
                    src={value.thumbnail}
                    alt={value.title}
                    width={64}
                    height={64}
                  />
                  <div className="font-semibold">{value.title}</div>
                </div>
                <div className="text-xs max-md:col-span-7 col-span-4 flex items-center p-2">
                  {value.description}
                </div>
                <div className="font-semibold flex items-center max-md:col-span-7 justify-end p-2">
                  ${value.price}
                </div>
              </Fragment>
            ))}
        </div>
        <Pagination />
      </div>
      <AnimatePresence>
        {!!products.details && (
          <Details />
        )}
      </AnimatePresence>
    </div>
  );
}
