import { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/react"

export const loader: LoaderFunction = async () => {
    return redirect("/")
}