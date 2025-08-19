import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import img1 from "../assets/51.jpg";
import img2 from "../assets/52.jpg";
import img3 from "../assets/53.jpg";
import img4 from "../assets/54.jpg";
import img5 from "../assets/55.jpg";
import img6 from "../assets/56.jpg";
import img7 from "../assets/58.jpg";

const FeaturedCollection = () => {
  const featuredNFTs = [img1, img2, img3, img4, img5, img6, img7];

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold text-indigo-300 mb-8 text-center">
        Featured Collection
      </h2>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {featuredNFTs.map((url, idx) => (
          <SwiperSlide key={idx}>
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
              <img
                src={url}
                alt={`Featured NFT ${idx + 1}`}
                className="w-full h-72 object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedCollection;
