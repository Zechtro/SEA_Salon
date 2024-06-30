import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData, Form, useActionData, redirect } from "@remix-run/react";
import { Button } from "../../components/Button";
import { ReservationEntry, createReservation } from "../../models/reservation";
import { addReservation } from "../../utils/reservation.server";
import { dropDownEntry } from "./interface";
import { validate } from "./validate";
import { getUserSession } from "../../utils/session.server";
import { Table_Branch, Table_Service, getTableBranchServices, getTableCustomerReservation } from "../../utils/db.server";
import { isUserAdmin } from "../../utils/user.server";
import { BranchInfo } from "../../models/branch";
import { BranchServices } from "../../models/branch_services";
import { useState } from "react";

interface BranchServiceMap {
  [key: string]: string[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if(!sessionUser){
    return redirect("/")
  }
  const email = sessionUser.email as string
  const isAdmin: boolean = await isUserAdmin(email) as boolean
  if(isAdmin){
    return redirect("/")
  }

  const dropDownServices : dropDownEntry[] = []
  try{
    const servicesDocs = await Table_Service.get()
    servicesDocs.forEach(doc =>
      dropDownServices.push({
        label: doc.data().service_name,
        value: doc.data().service_name
      })
    )
  } catch (error) {
    console.error("Error fetching services:", error);
    return redirect("/reservation")
  }

  let reservations: ReservationEntry[]
  try{
    const reservationsDocs = await getTableCustomerReservation(sessionUser.email as string).get()
    reservations = reservationsDocs.docs.map(doc => ({
      name: doc.data().name,
      phone_number: doc.data().phone_number,
      service: doc.data().service,
      datetime: doc.data().datetime
    })).sort((a, b) => b.datetime.localeCompare(a.datetime))
  } catch (error) {
    reservations = []
    return redirect("/reservation")
  }

  let branches: BranchInfo[]
  try{
    branches = (await Table_Branch.get()).docs.map(doc => ({
      branch_name: doc.data().branch_name,
      location: doc.data().location,
      open_time: doc.data().open_time,
      close_time: doc.data().close_time
    }))
  }catch(error){
    console.log(error)
    return redirect("/reservation")
  }

  const mapBranchServices: BranchServiceMap = {}
  try{
    for (const branch of branches){
      const branchServices: BranchServices[] = (await getTableBranchServices(branch.branch_name).get()).docs.map(doc => ({
        service_name: doc.data().service_name,
        is_available: doc.data().is_available
      }))

      for (const branchService of branchServices){
        const is_available = branchService.is_available
        if(is_available){
          if (!(branch.branch_name in mapBranchServices)) {
            console.log(!(branch.branch_name in mapBranchServices))
            mapBranchServices[branch.branch_name] = []
          }
          mapBranchServices[branch.branch_name].push(branchService.service_name)
        }
        console.log(mapBranchServices)
      }
    }
  }catch(error){
    console.log(error)
    return redirect("/reservation")
  }

  return json({ mapBranchServices: mapBranchServices, branches: branches, dropDownServices: dropDownServices, recentReservations: reservations });
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
    const sessionUser = await getUserSession(request);
    const userEmail: string = sessionUser?.email as string
    await addReservation(reservation, userEmail)
  }
  
  return { error: !error ? null : error, success: error ? null : "Reservation success" }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Reservation" },
    { name: "description", content: "Reserve your services" },
  ];
};

export default function Reservation() {
  const loaderData = useLoaderData<typeof loader>()
  // const branches = loaderData.branches
  const dropDownServices = loaderData.dropDownServices
  const recentReservations = loaderData.recentReservations
  const mapBranchServices = loaderData.mapBranchServices
  const actionData = useActionData<typeof action>()
  const invalidName = actionData?.error?.invalidName
  const invalidPhoneNumber = actionData?.error?.invalidPhoneNumber
  const invalidDatetime = actionData?.error?.invalidDatetime
  const successMessage = actionData?.success

  const [selectedBranch, setSelectedBranch] = useState<string>('')

  return (
    <div className="font-sans flex flex-col items-center">
      <h1 className="h1 mt-[5vh]">Reservation</h1>
      {/* Reservation Form Section */}
      <section>
        <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[80vw] sm:w-[50vw] sm:h-[85vh] rounded-lg border-4 border-accent">
          <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
            <label htmlFor="name" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Name</label>
            <div className="w-[40vw] sm:w-[30vw]">
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
              />
              {invalidName && (
                <span className="text-red-500 h-[2vh] text-[2vh]">
                  {invalidName}
                </span>
              )}
            </div> 
          </div>
          <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
            <label htmlFor="phone_number" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Phone Number</label>
            <div className="w-[40vw] sm:w-[30vw]"> 
              <input
                name="phone_number"
                type="number"
                min={0}
                placeholder="08123456789"
                required
                className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
              />
              {invalidPhoneNumber && (
                <span className="text-red-500 h-[2vh] text-[2vh] ">
                  {invalidPhoneNumber}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
            <label htmlFor="branch" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Branch</label>
            <select
              name="branch"
              required
              onChange={(e) => setSelectedBranch(e.target.value as string)}
              className="sm:w-[30vw] w-[40vw] h-[3vh] sm:h-[6vh] text-[1.1vh] sm:text-[2.1vh] rounded-lg border-2 border-accent p-2"
            >
              <option value="">Choose Branch</option>
              {Object.entries(mapBranchServices).map(([branchName]) => (
                <option key={branchName} value={branchName}>
                  {branchName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
            <label htmlFor="service" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Service</label>
            <select
              name="service"
              required
              className="sm:w-[30vw] w-[40vw] h-[3vh] sm:h-[6vh] text-[1.1vh] sm:text-[2.1vh] rounded-lg border-2 border-accent p-2"
            >
              <option value="">Choose Service</option>
              {mapBranchServices[selectedBranch]?.map((service_name) => (
                <option key={service_name} value={service_name}>
                  {service_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
            <label htmlFor="datetime" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Date and Time</label>
            <div className="w-[40vw] lg:w-[30vw]"> 
              <input
                name="datetime"
                type="datetime-local"
                required
                className="w-[40vw] lg:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
              />
              {invalidDatetime && (
                <span className="text-red-500 h-[2vh] text-[2vh] ">
                  {invalidDatetime}
                </span>
              )}
            </div>
          </div>
          {successMessage && (
              <span className="flex justify-center text-green-500 h-[2vh] text-[2vh] sm:w-[70vw] lg:w-[50%]">
                {successMessage}
              </span>
            )}
          <Button type="submit">
            Submit
          </Button>
        </Form >
      </section>

      {/* Recent Reservations List Section */}
      <section className="flex flex-col items-center mt-[8vh] w-full">
        <h2 className="h2">Recent Reservations</h2>
        <div className="flex w-[75vw] flex-col items-center mt-[3vh]">
          <div className="overflow-auto rounded-lg shadow hidden lg:block w-full">
            <table className="w-full">
              <thead className="bg-accent border-b-2 border-accent">
              <tr>
                <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Name</th>
                <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Phone Number</th>
                <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Service</th>
                <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Date</th>
                <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Time</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentReservations.map((reservation: ReservationEntry) => (
                <tr key={`${reservation.name}-${reservation.phone_number}-${reservation.service}-${reservation.datetime}`} className="bg-gray-100">
                  <td className="p-3 text-sm text-primary whitespace-nowrap">
                    <p className="text-[3vh] p-3">{reservation.name}</p>
                  </td>
                  <td className="p-3 text-sm text-primary  whitespace-nowrap">
                    <p className="text-[3vh] p-3">{reservation.phone_number}</p>
                  </td>
                  <td className="p-3 text-sm text-primary  whitespace-nowrap">
                    <p className="text-[3vh] p-3">{reservation.service}</p>
                  </td>
                  <td className="p-3 text-sm text-primary  whitespace-nowrap">
                    <p className="text-[3vh] p-3">{`${(new Date(reservation.datetime)).getFullYear()}/${(new Date(reservation.datetime)).getMonth()}/${(new Date(reservation.datetime)).getDate()}`}</p>
                  </td>
                  <td className="p-3 text-sm text-primary  whitespace-nowrap">
                    <p className="text-[3vh] p-3">{`${(new Date(reservation.datetime)).getHours()}:${(new Date(reservation.datetime)).getMinutes().toString().length === 1 ? `0${(new Date(reservation.datetime)).getMinutes()}` : (new Date(reservation.datetime)).getMinutes()}`}</p>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {recentReservations.map((reservation: ReservationEntry) => (
              <div key={`${reservation.name}-${reservation.phone_number}-${reservation.service}-${reservation.datetime}`} className="w-[30vw] bg-accent space-y-3 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center space-x-2 text-sm">
                  <div>
                    <div className="text-primary font-bold hover:underline">{reservation.name}</div>
                  </div>
                  <div className="text-gray-500">{`${(new Date(reservation.datetime)).getDate()}/${(new Date(reservation.datetime)).getMonth()}/${(new Date(reservation.datetime)).getFullYear()}`}</div>
                </div>
                <div className="text-sm text-primary font-emibold">
                  {reservation.service}
                </div>
                <div className="text-sm font-medium text-black">
                  {`${(new Date(reservation.datetime)).getHours()}:${(new Date(reservation.datetime)).getMinutes().toString().length === 1 ? `0${(new Date(reservation.datetime)).getMinutes()}` : (new Date(reservation.datetime)).getMinutes()}`}
                </div>
              </div>
            ))}

          </div>
        </div>

      </section>
    </div>
  )
}