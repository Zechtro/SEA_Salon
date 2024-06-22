import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { SalonSlogan, Contact1Name, Contact1Number, Contact2Name, Contact2Number, Service1, Service2, Service3, Service4, Service5, Service1_img , Service2_img, Service3_img, Service4_img, Service5_img, SalonName } from "../components/SalonStaticVar";
import type { LoaderFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import { FaStar } from "react-icons/fa"
import { useState } from "react";
import { Form } from "@remix-run/react";
import { Button } from "../components/ButtonFormReview";

interface Service {
  image_url: string;
  service_name: string;
}

interface Review {
  nama_user: string;
  rating: number;
  comment: string;
}

const reviews: Review[] = [
  {nama_user: "UserDummy1", rating: 5, comment: "GG BANG"},
  {nama_user: "UserDummy2", rating: 3, comment: "GACORRRRR"},
  {nama_user: "UserDummy3", rating: 1, comment: "HAHHHH ??!?!?! JADI DUTA SALON LAIN?!?!?! EHEHAHAHAH"},
  {nama_user: "UserDummy4", rating: 2, comment: "Rill khhh"},
  {nama_user: "UserDummy5", rating: 4, comment: "Seriusss??"},
  {nama_user: "UserDummy6", rating: 5, comment: "Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah Isshhh panjang kali lah"},
  {nama_user: "UserDummy7", rating: 1, comment: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXXXXXXXXXXXXXXXXXXXX"},
  {nama_user: "UserDummy8", rating: 5, comment: "GG BANG"},
];

export const loader: LoaderFunction = async () => {
  const services: Service[] = [
    {image_url: Service1_img, service_name: Service1},
    {image_url: Service2_img, service_name: Service2},
    {image_url: Service3_img, service_name: Service3},
    {image_url: Service4_img, service_name: Service4},
    {image_url: Service5_img, service_name: Service5},
  ];

  return json({ services, reviews });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  if(formData.get("rating") !== null && !formData.get("comment") !== null){
    const rating: number = parseInt(formData.get("rating") as string);
    const comment: string = formData.get("comment") as string;
    console.log(formData.get("rating"));
    console.log(formData.get("comment"));
    reviews.push({nama_user: "UserX", rating: rating, comment: comment});
  }
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: {SalonName} },
    { name: "description", content: {SalonSlogan} },
  ];
};



export default function Index() {
  const { services, reviews } = useLoaderData<{ services: Service[], reviews: Review[] }>();
  const [rating, setRating] = useState(0);

  const handleClick = (index: number) => {
    if (index === rating) {
      setRating(0);
    } else {
      setRating(index);  
    }
  };

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
          {reviews.map((review: Review) => (
            <SwiperSlide key={review.nama_user} className="flex flex-row justify-around items-center">
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
                  <p className="break-all overflow-y-auto h-[20vh]">
                    {review.comment}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
        </Swiper>
      </section>

      {/* REVIEW FORM SECTION */}
      <section>
        <h2 className="h2 flex justify-center mt-[5vh]">Review Us!</h2>
        <Form method="post" className="flex flex-col ">
          <div className="flex flex-row mt-[2vh] w-full justify-center">
            <div className="flex w-[40vw] justify-around">
              {[...Array(5)].map((_, index) => (
                <FaStar
                key={index}
                size={70}
                color={index < (rating) ? 'gold' : 'lightgray'}
                onClick={() => handleClick(index + 1)}
                style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <input name="rating" type="number" hidden value={rating} />
          </div>

          <div className="mt-[3vh] flex justify-center">
            <textarea
                name="comment"
                rows={4}
                placeholder="Share your experience"
                className="resize-none flex items-start sm:w-[70vw] lg:w-[50%] border-[0.2vw] border-accent rounded-[1vw] p-4 h-[45vh]"
                required
            ></textarea>
          </div>

          <div className="flex w-full justify-center mt-[3vh]">
            <Button type="submit">Send Review</Button>
          </div>
        </Form >
      </section>

      {/* FOOTER */}
      <footer className="pt-[5vh] pb-[5vh] bg-accent mt-[10vh] relative z-20">
        <div className="container mx-auto px-0 flex flex-col items-center justify-between">
          <div className="flex flex-col xl:flex-row justify-around items-center w-full">
            <div className="flex flex-col justify-around xl:justify-start items-center xl:items-start">
              <h2 className="h2">{SalonName}</h2>
              <p><em>{SalonSlogan}</em></p>
              <br></br>
            </div>
            <div className="flex flex-col justify-around xl:justify-start items-center xl:items-start">
              <h3 className="h3">Contact Information</h3>
              <p>{Contact1Name} : {Contact1Number}</p>
              <p>{Contact2Name} : {Contact2Number}</p>
            </div>
          </div>
          <p className="mt-[10vh] text-[2vh]">Copyright &copy; SEA Salon 2024. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
