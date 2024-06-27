import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Table_User } from "../../utils/db.server";
import { getUserSession } from "../../utils/session.server";
import { User } from "../../models/user";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if(!sessionUser){
    return redirect("/")
  }
  const email: string = sessionUser.email as string
  const user: User = (await Table_User.doc(email).get()).data() as User

  return {
    email: email,
    user: user
  }
}

export async function action() {
    return null
}

export default function Profile() {
    const loaderData = useLoaderData<typeof loader>()
    const user: User = loaderData.user
    const email: string = loaderData.email

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Profile</h1>
          <div className="flex flex-col justify-around items-center mt-[5vh] w-[50vw] sm:h-[70vh] lg:h-[60vh] rounded-lg border-4 border-accent">
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Email</p>
              <div className="w-[30vw]">
                <p className="flex items-center w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2">
                  {email}
                </p>
              </div> 
            </div>
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Full Name</p>
              <div className="w-[30vw]">
                <p className="flex items-center w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2">
                  {user.full_name}
                </p>
              </div> 
            </div>
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Phone Number</p>
              <div className="w-[30vw]">
                <p className="flex items-center w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2">
                  {user.phone_number}
                </p>
              </div> 
            </div>
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Role</p>
              <div className="w-[30vw]">
                <p className="flex items-center w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2">
                  {user.admin ? "Admin" : "Customer"}
                </p>
              </div> 
            </div>
          </div >
        </div>
      )
  }