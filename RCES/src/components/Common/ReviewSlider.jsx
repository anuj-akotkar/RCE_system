import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import RatingStars from "./RatingStars";

const reviews = [
  {
    name: "Alice",
    review: "Great platform for coding contests!",
    rating: 5,
  },
  {
    name: "Bob",
    review: "Challenging problems and smooth UI.",
    rating: 4.5,
  },
   {
    name: "Alice",
    review: "Great platform for coding contests!",
    rating: 5,
  },
  {
    name: "Bob",
    review: "Challenging problems and smooth UI.",
    rating: 4.5,
  },
  // Add more reviews as needed
];

const ReviewSlider = () => (
  <div className="w-full max-w-2xl mx-auto py-8">
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 4000 }}
      aria-label="User reviews"
    >
      {reviews.map((item, idx) => (
        <SwiperSlide key={idx}>
          <div className="bg-richblack-800 p-6 rounded-lg shadow text-richblack-50 flex flex-col items-center">
            <RatingStars reviewCount={item.rating} starSize={24} />
            <p className="mt-4 text-lg italic">"{item.review}"</p>
            <span className="mt-2 font-semibold">{item.name}</span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default ReviewSlider;