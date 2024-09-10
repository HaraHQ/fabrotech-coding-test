import ProductStoreHook from "@/stores/product.store"
import { motion } from "framer-motion";
import { FC } from "react";
import { TiTimes } from "react-icons/ti";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const Details: FC = () => {
  const products = ProductStoreHook();

  return (
    <div className="fixed z-30 inset-0">
      <div
        className="fixed bg-black/20 cursor-pointer inset-0 z-40"
        onClick={() => products.clearDetail()}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 w-full lg:w-[50vw] bg-white h-screen z-50"
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full p-2 overflow-y-auto"
        >
          <div className="relative flex flex-col gap-4">
            <div className="absolute top-1 right-2">
              <TiTimes
                className="text-3xl cursor-pointer"
                onClick={() => products.clearDetail()}
              />
            </div>
            <div className="text-2xl font-semibold">
              {products.details?.title}
            </div>
            <div className="px-4 relative border">
              <div
                className={`absolute top-0 right-0 ${
                  products.details?.availabilityStatus === "In Stock"
                    ? "bg-green-500"
                    : "bg-red-500"
                } text-white px-8 py-1.5 rounded-bl-lg`}
              >
                {products.details?.availabilityStatus}
              </div>
              <Swiper
                slidesPerView={1}
                scrollbar={{ draggable: true }}
                modules={[Pagination]}
                pagination={{ clickable: true }}
              >
                {products.details?.images.map((image, index) => (
                  <SwiperSlide key={`${image}_${index}`}>
                    <motion.img
                      src={image}
                      className="w-full h-[300px] object-contain"
                      layoutId={`product-${products.details?.id}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="text-sm px-4">
              {products.details?.description}
            </div>
            <div className="flex justify-end text-3xl text-rose-600 px-4">
              ${products.details?.price}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Details;