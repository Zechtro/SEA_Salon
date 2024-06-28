import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "../../components/Button";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "../../utils/session.server";
import { isUserAdmin } from "../../utils/user.server";
import { createBranch, BranchInfo } from "../../models/branch";
import { addBranch } from "../../utils/branch.server";
import { Table_Branch } from "../../utils/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if(!sessionUser){
    return redirect("/")
  }
  const email = sessionUser.email as string
  const isAdmin: boolean = await isUserAdmin(email) as boolean
  if(!isAdmin){
    return redirect("/")
  }

  const branches: BranchInfo[] = []
  try{
    const branchesDocs = (await Table_Branch.get())
    branchesDocs.forEach(doc => 
      branches.push({
        branch_name: doc.data().branch_name,
        location: doc.data().location,
        open_time: doc.data().open_time,
        close_time: doc.data().close_time,
      })
    )
  } catch(error) {
    console.log(error)
  }

  return { branches: branches }
}

export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData();

  const branch_name: string = formData.get("branch_name") as string;
  const location: string = formData.get("location") as string;
  const open_time: string = formData.get("open_time") as string;
  const close_time: string = formData.get("close_time") as string;
  if(close_time < open_time){
    return {
      error: "Invalid operational hour",
      success: null
    }
  }
  try {
    const newBranch: BranchInfo = createBranch(branch_name, location, open_time, close_time)
    await addBranch(newBranch)
    return {
      error: null,
      success: "Branch added"
    }
  } catch (error) {
    return {
      error: error as string,
      success: null
    }
  }
}

export default function Branch() {
    const actionData = useActionData<typeof action>();
    const invalidBranchName = null
    const invalidLocation = null
    const invalidOpenCloseTime = actionData?.error
    const successMessage = actionData?.success
    const loaderData = useLoaderData<typeof loader>()
    const branches: BranchInfo[] = loaderData.branches

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Add Branch</h1>
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[80vw] sm:w-[50vw] sm:h-[70vh] lg:h-[60vh] rounded-lg border-4 border-accent">
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="branch_name" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Branch Name</label>
               <div className="w-[40vw] sm:w-[30vw]">
                <input
                  name="branch_name"
                  type="text"
                  placeholder="Branch Name"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidBranchName && (
                  <span className="text-red-500 h-[2vh] text-[2vh]">
                    {invalidBranchName}
                  </span>
                )}
              </div> 
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="location" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Location</label>
              <div className="w-[40vw] sm:w-[30vw]"> 
                <input
                  name="location"
                  type="text"
                  placeholder="Bandung, Jl. Soekarno Hatta No. 999"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidLocation && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidLocation}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="open_time" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Open</label>
              <div className="w-[40vw] sm:w-[30vw]"> 
                <input
                  name="open_time"
                  type="time"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="close_time" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Close</label>
              <div className="w-[40vw] sm:w-[30vw]"> 
                <input
                  name="close_time"
                  type="time"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidOpenCloseTime && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidOpenCloseTime}
                  </span>
                )}
              </div>
            </div>
            {successMessage && (
              <span className="text-green-500 h-[2vh] text-[2vh] ">
                {successMessage}
              </span>
            )}
            <Button type="submit">
              Add
            </Button>
          </Form >

          <section className="flex flex-col items-center mt-[8vh] w-full">
            <h2 className="h2">Branches</h2>
            <div className="flex w-[75vw] flex-col items-center mt-[3vh]">
              <div className="overflow-auto rounded-lg shadow hidden lg:block w-full">
                <table className="w-full">
                  <thead className="bg-accent border-b-2 border-accent">
                  <tr>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Branch Name</th>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Location</th>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Open</th>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Close</th>
                    <th className="w-[15vw] p-3 text-[3.5vh] font-semibold tracking-wide text-center text-white">Services</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {branches.map((branch: BranchInfo) => (
                    <tr key={`${branch.branch_name}-${branch.location}-${branch.open_time}-${branch.close_time}`} className="bg-gray-100">
                      <td className="p-3 text-sm text-primary whitespace-nowrap">
                        <p className="text-[3vh] p-3">{branch.branch_name}</p>
                      </td>
                      <td className="p-3 text-sm text-primary  whitespace-nowrap">
                        <p className="text-[3vh] p-3">{branch.location}</p>
                      </td>
                      <td className="p-3 text-sm text-primary  whitespace-nowrap">
                        <p className="text-[3vh] p-3">{branch.open_time}</p>
                      </td>
                      <td className="p-3 text-sm text-primary  whitespace-nowrap">
                        <p className="text-[3vh] p-3">{branch.close_time}</p>
                      </td>
                      <td className="p-3 text-sm text-primary  whitespace-nowrap flex justify-center">
                        <button className="p-2 rounded-md bg-accent text-accent-secondary hover:bg-accent-hover">Services</button>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {branches.map((branch: BranchInfo) => (
                  <div key={`${branch.branch_name}-${branch.location}-${branch.open_time}-${branch.close_time}`} className="w-[30vw] bg-accent space-y-3 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center space-x-2 text-sm">
                      <div>
                        <div className="text-primary font-bold hover:underline">{branch.branch_name}</div>
                      </div>
                    </div>
                    <div className="text-gray-500">{branch.location}</div>
                    <div className="text-sm text-primary font-emibold">
                      {branch.open_time} - {branch.close_time}
                    </div>
                    <div className="text-sm font-medium text-black">
                      <button className="bg-white p-2 rounded-md hover:bg-gray-500 hover:text-white">Services</button>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </section>
        </div>
      )
  }