import type { MetaFunction } from "@remix-run/node";
import { SalonSlogan, Contact1Name, Contact1Number, Contact2Name, Contact2Number, Service1, Service2, Service3, Service4, Service5, Service1_img , Service2_img, Service3_img, Service4_img, Service5_img, SalonName } from "../components/SalonStaticVar";
import type { LoaderFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules'; 

interface Service {
  image_url: string;
  service_name: string;
}

export const loader: LoaderFunction = async () => {
  const services: Service[] = [
    {image_url: Service1_img, service_name: Service1},
    {image_url: Service2_img, service_name: Service2},
    {image_url: Service3_img, service_name: Service3},
    {image_url: Service4_img, service_name: Service4},
    {image_url: Service5_img, service_name: Service5},
  ];
  return json({ services })
}

export const meta: MetaFunction = () => {
  return [
    { title: {SalonName} },
    { name: "description", content: {SalonSlogan} },
  ];
};

export default function Index() {
  const { services } = useLoaderData<typeof loader>();
  

  return (
    <div className="font-sans p-4">
      <section className="hero h-[640px] xl:h-[840px] bg-hero sm:bg-bottom lg:bg-center lg:bg-cover bg-no-repeat bg-fixed sm:rounded-bl-[150px]  xl:rounded-bl-[290px] relative z-20">
        <div className="container mx-auto h-full flex items-center justify-center xl:justify-start">
          <div className="hero__text w-[567px] flex flex-col items-center text-center xl:text-left lg:items-start">
            <h1 className="h1 mb-8">{SalonSlogan}</h1>
            <p className="mb-8">Open from 09.00 AM - 09.00 PM</p>
          </div>
        </div>
      </section>

      <br></br>

      <section className="mt-[20px] xl:mt-[20px] z-20">
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
          {services.map((service: Service) => (
            <SwiperSlide key={service.service_name} className="flex flex-row justify-center items-center">
              <div  className="bg-cover bg-center mb-[4vh] sm:h-[35vh] w-[25vw] lg:h-[70vh] relative z-20 rounded-xl flex justify-center items-end" style={{ backgroundImage: `url(${service.image_url})` }}>
                <div className="h-[20%] w-[100%] overflow-hidden flex justify-center items-center text-center backdrop-filter backdrop-blur-sm bg-white/50 lg:rounded-tr-[60px] sm:rounded-tr-[30px] rounded-br-xl">
                  <h3 className="lg:text-[25px] sm:text-[15px] xl:text-[35px]">{service.service_name}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
        </Swiper>
      </section>

      <br></br>

      <address>
        <h5 className="text-2xl">Contact</h5>
        <p>{Contact1Name} : {Contact1Number}</p>
        <p>{Contact2Name} : {Contact2Number}</p>
      </address>
    </div>
  );
}
