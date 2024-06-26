import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Service1, Service2, Service3, Service4, Service5} from "../../components/SalonStaticVar";
import type { LoaderFunction } from "@remix-run/node";
import { json, useLoaderData, Form, useActionData } from "@remix-run/react";
import { Button } from "../../components/ButtonFormReview";
import { ReservationEntry, createReservation } from "../../models/reservation";
import { addReservation } from "../../utils/reservation.server";
import { dropDownEntry } from "./interface";
import { validate } from "./validate";

export const loader: LoaderFunction = async () => {
  const dropDownServices : dropDownEntry[] = [
    {label: Service1, value: Service1},
    {label: Service2, value: Service2},
    {label: Service3, value: Service3},
    {label: Service4, value: Service4},
    {label: Service5, value: Service5},
  ];

  return json({ dropDownServices });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const datetimestring : string = formData.get("datetime") as string;
  const name: string = (formData.get("name") as string).trim();
  const service: string = formData.get("service") as string;
  const phone_number: string = formData.get("phone_number") as string;  

  const error = validate(name,phone_number,service,datetimestring)

  if(!error){
    const reservation: ReservationEntry = createReservation(name,phone_number,service,datetimestring)
    await addReservation(reservation)
  }
  
  return { error }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Reservation" },
    { name: "description", content: "Reserve your services" },
  ];
};

export default function Reservation() {
  const { dropDownServices} = useLoaderData<{dropDownServices: dropDownEntry[]}>();
  const actionData = useActionData<typeof action>()
  const invalidName = actionData?.error?.invalidName
  const invalidPhoneNumber = actionData?.error?.invalidPhoneNumber
  const invalidDatetime = actionData?.error?.invalidDatetime

  return (
    <div className="font-sans flex flex-col items-center">
      <h1 className="h1 mt-[5vh]">Reservation</h1>
      <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[50vw] sm:h-[70vh] lg:h-[60vh] rounded-lg border-4 border-accent">
        <div className="flex sm:flex-col lg:flex-row justify-around">
          <label htmlFor="name" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Name</label>
           <div className="w-[30vw]">
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
            />
            {invalidName && (
              <span className="text-red-500 h-[2vh] text-[2vh]">
                {invalidName}
              </span>
            )}
          </div> 
        </div>
        <div className="flex sm:flex-col lg:flex-row justify-around">
          <label htmlFor="phone_number" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Phone Number</label>
          <div className="w-[30vw]"> 
            <input
              name="phone_number"
              type="number"
              min={0}
              placeholder="08123456789"
              required
              className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
            />
            {invalidPhoneNumber && (
              <span className="text-red-500 h-[2vh] text-[2vh] ">
                {invalidPhoneNumber}
              </span>
            )}
          </div>
        </div>
        <div className="flex sm:flex-col lg:flex-row justify-around">
          <label htmlFor="service" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Service</label>
          <select
            name="service"
            required
            className="sm:w-[35vw] lg:w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent"
          >
            <option value="">Choose Service</option>
            {dropDownServices.map((option: dropDownEntry) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex sm:flex-col lg:flex-row justify-around">
          <label htmlFor="datetime" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Date and Time</label>
          <div className="w-[30vw]"> 
            <input
              name="datetime"
              type="datetime-local"
              required
              className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
            />
            {invalidDatetime && (
              <span className="text-red-500 h-[2vh] text-[2vh] ">
                {invalidDatetime}
              </span>
            )}
          </div>
        </div>
        <Button type="submit">
          Submit
        </Button>
      </Form >
    </div>
  )
}