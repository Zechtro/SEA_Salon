import { Form, json } from "@remix-run/react";
import { Button } from "../../components/ButtonFormReview";
import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    const dropDownServices = [
      {label: "Service1", value: "Service1"},
      {label: "Service2", value: "Service2"},
      {label: "Service3", value: "Service3"},
      {label: "Service4", value: "Service4"},
      {label: "Service5", value: "Service5"},
    ];
  
    return json({ dropDownServices });
  }

export async function action({ request }: ActionFunctionArgs) {

    // User ID
    // Full Name
    // Email
    // Phone Number
    // Password + Hashing
    // Role (Customer/Admin)

    return null
}

export default function Signup() {
    const invalidFullname = null
    const invalidEmail = null
    const invalidPhonenumber = null
    const invalidPassword = null

    return (
        <div className="font-sans flex flex-col items-center">
          <h1 className="h1 mt-[5vh]">Sign Up</h1>
          <Form method="post" className="flex flex-col justify-around items-center mt-[5vh] w-[50vw] sm:h-[70vh] lg:h-[60vh] rounded-lg border-4 border-accent">
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <label htmlFor="fullname" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Full Name</label>
               <div className="w-[30vw]">
                <input
                  name="fullname"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidFullname && (
                  <span className="text-red-500 h-[2vh] text-[2vh]">
                    {invalidFullname}
                  </span>
                )}
              </div> 
            </div>
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
                {invalidEmail && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidEmail}
                  </span>
                )}
              </div>
            </div>
            <div className="flex sm:flex-col lg:flex-row justify-around">
              <label htmlFor="phone_number" className="sm:w-[30vw] lg:w-[15vw] text-[3vh]">Phone Number</label>
              <div className="w-[30vw]"> 
                <input
                  name="phone_number"
                  type="number"
                  min={0}
                  placeholder="08123456789"
                  required
                  className="w-[30vw] h-[5vh] text-[3vh] rounded-lg border-2 border-accent p-2"
                />
                {invalidPhonenumber && (
                  <span className="text-red-500 h-[2vh] text-[2vh] ">
                    {invalidPhonenumber}
                  </span>
                )}
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