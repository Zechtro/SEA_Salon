import { Form, useActionData } from "@remix-run/react";
import { Button } from "../../components/ButtonFormReview";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { signIn } from "../../utils/db.server";
import { createUserSession, getUserSession, signOut } from "../../utils/session.server";
import { isUserAdmin } from "../../utils/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  if(sessionUser){
    return signOut(request)
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
    const isAdmin: boolean = await isUserAdmin(email) as boolean
    const redirectTo: string = isAdmin ? "/salon_services" : "/"
    return createUserSession(token, redirectTo);
  } catch (error) {
    return { error: "Invalid email or password"}
  }
}

export default function Signup() {
    const actionData = useActionData<typeof action>()
    const invalidEmailorPassword = actionData?.error

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Login</h1>
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[50vw] h-[40vh] rounded-lg border-4 border-accent">
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <label htmlFor="email" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Email</label>
              <div className="w-[30vw]"> 
                <input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
                />
              </div>
            </div>
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <label htmlFor="password" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Password</label>
              <div className="w-[30vw]"> 
                <input
                  name="password"
                  type="password"
                  required
                  className="w-[30vw] h-[5vh] text-[8vh] rounded-lg border-2 border-accent p-2"
                />
              </div>
            </div>
            {invalidEmailorPassword && (
              <span className="text-red-500 h-[2vh] text-[2vh] ">
                {invalidEmailorPassword}
              </span>
            )}
            <Button type="submit">
              Login
            </Button>
          </Form >
        </div>
      )
  }