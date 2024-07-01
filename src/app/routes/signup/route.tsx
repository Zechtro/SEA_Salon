import { Form, useActionData } from "@remix-run/react";
import { Button } from "../../components/Button";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { signUp } from "../../utils/db.server";
import { createUserSession, getUserSession, signOut } from "../../utils/session.server";
import { User, createUser } from "../../models/user";
import { addUser } from "../../utils/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if(sessionUser){
    return signOut(request)
  }

  return null
}

export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData();

  const email: string = formData.get("email") as string;
  const fullname: string = formData.get("fullname") as string;
  const phone_number: string = formData.get("phone_number") as string;
  const password: string = formData.get("password") as string;
  try {
    const { user } = await signUp(email, password);
    const token = await user.getIdToken();
    const newUser: User = createUser(fullname, phone_number)
    await addUser(newUser,email)
    return createUserSession(token, "/profile");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return {
        error: "Email already exists"
      }
    } else {
      return {
        error: "Invalid email"
      }
    }
  }
}

export default function Signup() {
    const actionData = useActionData<typeof action>();
    const invalidFullname = null
    const invalidEmail = actionData?.error
    const invalidPhonenumber = null
    const invalidPassword = null

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Sign Up</h1>
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[80vw] sm:w-[50vw] h-[75vh] sm:h-[80vh] lg:h-[70vh] rounded-lg border-4 border-accent">
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="fullname" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Full Name</label>
               <div className="w-[40vw] sm:w-[30vw]">
                <input
                  name="fullname"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidFullname && (
                  <span className="text-red-500 h-[2vh] text-[2vh]">
                    {invalidFullname}
                  </span>
                )}
              </div> 
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="email" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Email</label>
              <div className="w-[40vw] sm:w-[30vw]"> 
                <input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidEmail && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidEmail}
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
                {invalidPhonenumber && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidPhonenumber}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="password" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Password</label>
              <div className="w-[40vw] sm:w-[30vw]"> 
                <input
                  name="password"
                  type="password"
                  required
                  className="w-[40vw] sm:w-[30vw] h-[3vh] sm:h-[5vh] text-[1vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidPassword && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidPassword}
                  </span>
                )}
              </div>
            </div>
            <Button type="submit">
              Sign Up
            </Button>
          </Form >
        </div>
      )
  }