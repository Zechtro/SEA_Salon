import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Table_Branch, Table_Service, getTableBranchServices} from "../utils/db.server";
import { getUserSession } from "../utils/session.server";
import { BranchInfo } from "../models/branch";
import { isUserAdmin } from "../utils/user.server";
import { ServiceInfo } from "../models/service";
import { BranchServices, createBranchServices } from "../models/branch_services";
import { addBranchServices } from "../utils/branch_service.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log(params.branchName)
  const sessionUser = await getUserSession(request);
  if(!sessionUser){
      return redirect("/")
  }
  const email:string = sessionUser.email as string
  const isAdmin: boolean = await isUserAdmin(email) as boolean
  if(!isAdmin){
      return redirect("/")
  }

  let branch: BranchInfo
  let services: ServiceInfo[]
  let branchService: BranchServices[]
  const branch_name: string = params.branchName as string
  try{
    branch = (await Table_Branch.doc(params.branchName as string).get()).data() as BranchInfo
    if(!branch){
      return redirect("/branch")
    }
    services = (await Table_Service.get()).docs.map(doc => ({
      service_name: doc.data().service_name,
      duration: doc.data().duration,
      image_path: doc.data().image_path
    }))
    branchService = (await getTableBranchServices(branch_name).get()).docs.map(doc => ({
      service_name: doc.data().service_name,
      is_available: doc.data().is_available
    }))
  }catch(error){
    return redirect("/branch")
  }

  return {
    branch: branch,
    services: services,
    branchService: branchService
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const branch_name: string = params.branchName as string

  try{
    (await Table_Service.get()).forEach(async (doc) => {
      await addBranchServices(createBranchServices(doc.data().service_name, !!formData.get(doc.data().service_name)), branch_name);
    })
  } catch(error) {
    console.log(error)
  }

  return {
    success: "Services updated"
  }
}

export default function BranchName() {
  const loaderData = useLoaderData<typeof loader>()
  const branch: BranchInfo = loaderData.branch
  const services: ServiceInfo[] = loaderData.services
  const branchServices: BranchServices[] = loaderData.branchService
  const actionData = useActionData<typeof action>()
  const successMessage = actionData?.success

  return (
    <div className="font-sans flex flex-col items-center">

      <h1 className="h1 mt-[5vh]">Branch Info</h1>

      <div className="flex flex-col justify-around items-center mt-[5vh] w-[80vw] sm:w-[50vw] sm:h-[70vh] lg:h-[60vh] rounded-lg border-4 border-accent">
        
        <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
          <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">
            Branch Name
          </p>
          
          <div className="w-[40vw] sm:w-[30vw]">
            <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
              {branch.branch_name}
            </p>
          
          </div> 
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
          <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Location</p>
          <div className="w-[40vw] sm:w-[30vw]">
            <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
              {branch.location}
            </p>
          </div> 
        </div>

        <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
          <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Open</p>
          
          <div className="w-[40vw] sm:w-[30vw]">
            <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
              {branch.open_time}
            </p>
          </div>

        </div>

        <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
          <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Close</p>
          
          <div className="w-[40vw] sm:w-[30vw]">
            <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
              {branch.close_time}
            </p>
          </div> 
          
        </div>
      </div>

      <section className="flex flex-col justify-center">
        <h2 className="h2 mt-[10vh]">Available Services</h2>
          {branchServices.map((branchService: BranchServices) => branchService.is_available && (
            <div key={branchService.service_name} className="flex justify-center">
              <p className="pl-4">{branchService.service_name}</p>
            </div>
          ))}
      </section>

      <section className="flex flex-col justify-center">
        <h2 className="h2 mt-[10vh]">Edit Services</h2>
        <Form method="post" className="mt-[1vh] flex flex-col justify-center">
          {services.map((service: ServiceInfo) => (
            <div key={service.service_name} className="flex justify-start">
              <input
                type="checkbox"
                name={service.service_name}
              />
              <label htmlFor={service.service_name} className="pl-4">{service.service_name}</label>
            </div>
          ))}
          <Link to="/salon_services" className="flex justify-center text-accent hover:text-accent-hover border border-accent rounded-md">+</Link>
          {successMessage && (
              <span className="flex justify-center text-green-500 h-[2vh] text-[2vh] sm:w-[70vw] lg:w-[50%]">
                {successMessage}
              </span>
            )}
          <button type="submit" className="flex justify-center mt-[2vh] bg-accent hover:bg-accent-hover text-accent-secondary rounded-lg">Update</button>
        </Form>
      </section>
    </div>
  )
}