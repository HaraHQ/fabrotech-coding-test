import ProductStoreHook from "@/stores/product.store";
import { FC } from "react";

const Pagination: FC = () => {
  const products = ProductStoreHook();

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2">
        <div className="border border-black">
          <select
            className="p-2"
            onChange={(e) =>
              products.setLimit(e.target.value as unknown as number)
            }
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div
          className="font-semibold flex items-center cursor-pointer hover:bg-neutral-200 p-2 border border-black"
          onClick={() =>
            products.setPage(products.page > 1 ? products.page - 1 : 1)
          }
        >
          Previous
        </div>
        <div
          className="font-semibold flex items-center cursor-pointer hover:bg-neutral-200 p-2 border border-black"
          onClick={() => products.setPage(products.page + 1)}
        >
          Next
        </div>
      </div>
    </div>
  )
}

export default Pagination;