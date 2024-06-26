import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {

  return null
}

export default function Authentication() {
  
    return (
    <div className="font-sans flex flex-col items-center">
      <div>
        Authentication Yeahhh
      </div>
      <Outlet />
    </div>
  )
  }