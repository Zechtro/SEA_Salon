import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "../../components/Button";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getUserSession } from "../../utils/session.server";
import { isUserAdmin } from "../../utils/user.server";
import { ServiceInfo, createService } from "../../models/service";
import { addService } from "../../utils/service.server";
import { Table_Service } from "../../utils/db.server";

export interface dropDownEntry {
    label: string,
    value: number
}

const dropDownServices : dropDownEntry[] = [
    {label: "15 min", value: 15},
    {label: "30 min", value: 30},
    {label: "45 min", value: 45},
    {label: "1 hr", value: 60},
    {label: "1 hr 15 min", value: 75},
    {label: "1 hr 30 min", value: 90},
    {label: "1 hr 45 min", value: 105},
    {label: "2 hr", value: 120},
]

export async function loader({ request }: LoaderFunctionArgs) {
    const sessionUser = await getUserSession(request);
    if(!sessionUser){
        return redirect("/")
    }
    const email:string = sessionUser.email as string
    const isAdmin: boolean = await isUserAdmin(email) as boolean
    if(!isAdmin){
        return redirect("/")
    }

    let services: ServiceInfo[] = []
    try {
      services = (await Table_Service.get()).docs.map(doc => ({
        service_name: doc.data().service_name,
        duration: doc.data().duration,
        image_path: doc.data().image_path
      }))
    }catch(error){
      return null
    }
    return ({services: services})
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const service_name: string = (formData.get("service_name") as string).trim()
  const duration: number = parseInt(formData.get("duration") as string)
  console.log(duration)
  if (service_name.length > 0){
    const service: ServiceInfo = createService(service_name, duration)
    await addService(service)
  }
  
  return {
    error: service_name.length === 0 ? "Blank service name" : null,
    success: service_name.length === 0 ? null : "Service added successfully"
  }
}

export default function Salon_services() {
    const actionData = useActionData<typeof action>()
    const invalidServiceName = actionData?.error
    const successMessage = actionData?.success
    const loaderData = useLoaderData<typeof loader>()
    const services: ServiceInfo[] = loaderData?.services

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Add Service</h1>
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[70vw] lg:w-[50vw] h-[40vh] rounded-lg border-4 border-accent">
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <label htmlFor="service_name" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Service Name</label>
              <div className="w-[30vw]"> 
                  <input
                  name="service_name"
                  type="text"
                  placeholder="Creambath"
                  required
                  className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
                  />
              </div>
            </div>
            {invalidServiceName && (
            <span className="text-red-500 h-[2vh] text-[2vh] ">
                {invalidServiceName}
            </span>
            )}
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <label htmlFor="duration" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Duration</label>
              <select
                name="duration"
                required
                className="sm:w-[35vw] lg:w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent"
              >
                <option value="">Choose Duration</option>
                {dropDownServices.map((option: dropDownEntry) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {successMessage && (
              <span className="flex justify-center text-green-500 h-[1vh] text-[2vh] sm:w-[70vw] lg:w-[50%]">
                {successMessage}
              </span>
            )}
            <Button type="submit">
              Add
            </Button>
          </Form >

          {/* All Services List Section */}
          <section className="flex flex-col items-center mt-[8vh] w-full">
            <h2 className="h2 flex justify-center">All Services</h2>
            <div className="flex w-[90vw] lg:w-[75vw] flex-col items-center mt-[3vh]">
              <div className="overflow-auto rounded-lg shadow block w-full">
                <table className="w-full">
                  <thead className="bg-accent border-b-2 border-accent">
                  <tr>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Service Name</th>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Duration</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map((service: ServiceInfo) => (
                    <tr key={`${service.service_name}`} className="bg-gray-100">
                      <td className="p-3 text-sm text-primary whitespace-nowrap">
                        <p className="text-[3vh] p-3 w-[35vw] overflow-y-hidden overflow-x-auto">{service.service_name}</p>
                      </td>
                      <td className="p-3 text-sm text-primary  whitespace-nowrap">
                        <p className="text-[3vh] p-3 w-[35vw] overflow-y-hidden overflow-x-auto">{service.duration} Minute</p>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden w-full">
                {services.map((service: ServiceInfo) => (
                  <div key={`${service.name}`} className="bg-accent space-y-3 mx-2 p-4 rounded-lg shadow w-[80vw] sm:w-[40vw]">
                    <div className="text-primary font-bold w-[75vw] sm:w-[35vw] overflow-y-hidden overflow-x-auto">{service.name}</div>
                    <div className="text-gray-500 overflow-y-hidden overflow-x-auto">{`${(new Date(service.datetime)).getDate()}/${(new Date(service.datetime)).getMonth()}/${(new Date(service.datetime)).getFullYear()}`}</div>
                    <div className="text-sm text-primary font-emibold overflow-y-hidden overflow-x-auto">
                      {`${(new Date(service.datetime)).getHours()}:${(new Date(service.datetime)).getMinutes().toString().length === 1 ? `0${(new Date(service.datetime)).getMinutes()}` : (new Date(service.datetime)).getMinutes()}`}
                    </div>
                    <div className="text-sm font-medium text-black overflow-y-hidden overflow-x-auto">
                      {service.service}
                    </div>
                    <div className="text-sm text-primary font-emibold overflow-y-hidden overflow-x-auto">
                      {service.branch}
                    </div>
                  </div>
                ))}

              </div> */}
            </div>

          </section>
        </div>
      )
  }