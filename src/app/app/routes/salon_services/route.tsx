import { Form, redirect, useActionData } from "@remix-run/react";
import { Button } from "../../components/ButtonFormReview";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Table_User, signIn } from "../../utils/db.server";
import { createUserSession, getUserSession } from "../../utils/session.server";
import { isUserAdmin } from "../../utils/user.server";

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
    return null
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const { user } = await signIn(email, password);
    const token = await user.getIdToken();
    const isAdmin: boolean = (await Table_User.doc(email).get()).data()?.admin as boolean
    const redirectTo: string = isAdmin ? "/salon_services" : "/"
    return createUserSession(token, redirectTo);
  } catch (error) {
    return { error: "Invalid email or password"}
  }
}

export default function Salon_services() {
    const actionData = useActionData<typeof action>()
    const invalidServiceName = actionData?.error

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Add Service</h1>
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[50vw] h-[40vh] rounded-lg border-4 border-accent">
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
            <Button type="submit">
              Add
            </Button>
          </Form >
        </div>
      )
  }