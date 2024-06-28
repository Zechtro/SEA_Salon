import { Form, useActionData } from "@remix-run/react";
import { Button } from "../../components/Button";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { signIn } from "../../utils/db.server";
import { createUserSession, getUserSession, signOut } from "../../utils/session.server";

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
    return createUserSession(token, "/profile");
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
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[80vw] sm:w-[50vw] sm:h-[40vh] lg:h-[30vh] rounded-lg border-4 border-accent">
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="email" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Email</label>
              <div className="w-[30vw]"> 
                <input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="w-[30vw] h-[3vh] sm:h-[5vh] text-[2vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between w-full p-4 items-center lg:p-4">
              <label htmlFor="password" className="sm:w-[30vw] lg:w-[15vw] text-[2vh] sm:text-[3vh]">Password</label>
              <div className="w-[30vw]"> 
                <input
                  name="password"
                  type="password"
                  required
                  className="w-[30vw] h-[3vh] sm:h-[5vh] md:text-[8vh] text-[2vh] sm:text-[3vh] rounded-lg border-2 border-accent p-2"
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