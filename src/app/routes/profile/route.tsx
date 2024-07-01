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
          <div className="flex flex-col justify-around items-center mt-[5vh] w-[80vw] sm:w-[50vw] sm:h-[70vh] lg:h-[60vh] rounded-lg border-4 border-accent">
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Email</p>
              <div className="w-[40vw] sm:w-[30vw]">
                <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
                  {email}
                </p>
              </div> 
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Full Name</p>
              <div className="w-[40vw] sm:w-[30vw]">
                <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
                  {user.full_name}
                </p>
              </div> 
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Phone Number</p>
              <div className="w-[40vw] sm:w-[30vw]">
                <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
                  {user.phone_number}
                </p>
              </div> 
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <p className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Role</p>
              <div className="w-[40vw] sm:w-[30vw]">
                <p className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[7vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2 overflow-y-clip overflow-x-auto">
                  {user.admin ? "Admin" : "Customer"}
                </p>
              </div> 
            </div>
          </div >
        </div>
      )
  }