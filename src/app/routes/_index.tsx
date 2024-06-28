import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { SalonSlogan, SalonName } from "../components/SalonStaticVar";
import { json, useLoaderData } from "@remix-run/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import { FaStar } from "react-icons/fa"
import { Review } from "../models/reviews";
import { Table_Review, Table_Service } from "../utils/db.server";
import { ServiceInfo } from "../models/service";

export const loader: LoaderFunction = async () => {

  let services: ServiceInfo[]
  try{
    const servicesDocs = await Table_Service.get()
    services = servicesDocs.docs.map(doc => ({
      service_name: doc.data().service_name,
      duration: doc.data().duration,
      image_path: doc.data().image_path,
    }))
  } catch (error) {
    console.error("Error fetching services:", error);
    services = []
  }

  let reviews: Review[]
  try{
    const reviewsDocs = await Table_Review.get()
    reviews = reviewsDocs.docs.map(doc => ({
      nama_user: doc.data().nama_user,
      rating: doc.data().rating,
      comment: doc.data().comment,
    })).sort((a, b) => b.rating - a.rating)
  } catch (error) {
    console.error("Error fetching reviews:", error);
    reviews = []
  }

  return json({ services, reviews });
}

export async function action() {
  return null
}

export const meta: MetaFunction = () => {
  return [
    { title: SalonName },
    { name: "description", content: SalonSlogan },
  ];
};

export default function Index() {
  const { services, reviews } = useLoaderData<{ services: ServiceInfo[], reviews: Review[] }>();

  return (
    <div className="font-sans">

      {/* HERO SECTION */}
      <section className="hero h-[640px] xl:h-[840px] bg-hero sm:bg-bottom lg:bg-center lg:bg-cover bg-no-repeat bg-fixed sm:rounded-bl-[150px]  xl:rounded-bl-[290px] relative z-20">
        <div className="container mx-auto h-full flex items-center justify-center xl:justify-start">
          <div className="hero__text w-[567px] flex flex-col items-center text-center xl:text-left lg:items-start">
            <h1 className="h1 mb-8">{SalonSlogan}</h1>
            <p className="mb-8">Open from 09.00 AM - 09.00 PM</p>
          </div>
        </div>
      </section>

      <br></br>

      {/* SERVICES SECTION */}
      <section className="mt-[20px] z-20 pl-4 pr-4">
        <h2 className="h2 flex justify-center">Our Services</h2>
        <Swiper
          spaceBetween={0}
          slidesPerView={3}
          pagination={{ 
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          grid={{
            rows: 1,
          }}
          breakpoints={{
            360: {
              grid: {
                rows: 2,
              },
              slidesPerGroup: 0,
            },
            960: {
              grid: {
                rows: 1,
              }
            }
          }}
          className="mt-[3vh]"
        >
          {services.map((service: ServiceInfo) => (
            <SwiperSlide key={service.service_name} className="flex w-[25vw] flex-row justify-center items-center">
              <div  className="bg-cover bg-center mb-[4vh] sm:h-[35vh] w-[25vw] lg:h-[70vh] relative z-20 rounded-xl flex justify-center items-end" style={{ backgroundImage: `url(${service.image_path})` }}>
                <div className="h-[20%] w-[100%] overflow-hidden flex justify-center items-center text-center backdrop-filter backdrop-blur-sm bg-white/50 lg:rounded-tr-[60px] sm:rounded-tr-[30px] rounded-br-xl">
                  <h3 className="lg:text-[25px] sm:text-[15px] xl:text-[35px]">{service.service_name}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
        </Swiper>
      </section>

      {/* REVIEW LIST SECTION */}
      <section className="mt-[10vh] z-20 pl-4 pr-4">
      <h2 className="h2 flex justify-center">Reviews</h2>
        <Swiper
          spaceBetween={0}
          pagination={{ 
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          grid={{
            rows: 1,
          }}
          breakpoints={{
            360: {
              slidesPerView: 1,
            },
            1200: {
              slidesPerView: 2,
            },
            1500: {
              slidesPerView: 3
            }
          }}
          className="w-[90vw] h-[48vh]"
        >
          {reviews && reviews.map((review: Review) => (
            <SwiperSlide key={review.nama_user} className="swiper-slide flex flex-row justify-around items-center">
              <div className="flex justify-center items-center sm:w-[70vw] xl:w-[40vw] 2xl:w-[25vw] h-[40vh] bg-white rounded-xl border-[0.2vw] border-accent">
                <div className="flex flex-col justify-around items-start sm:w-[65vw]  xl:w-[35vw] 2xl:w-[20vw] h-[35vh]">
                  <div>
                    <h3 className="h3">{review.nama_user}</h3>
                    <div className="flex flex-row w-full justify-start">
                      <div className="flex justify-start">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                          key={index}
                          size={20}
                          color={index < (review.rating) ? 'gold' : 'lightgray'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="overflow-y-auto h-[20vh] break-all">
                    {review.comment}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  )
}