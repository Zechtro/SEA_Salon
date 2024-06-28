import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import styles from "./tailwind.css?url";
import MainFooter from "./components/MainFooter";
import { SalonName } from "./components/SalonStaticVar";
import { getUserSession, signOut } from "./utils/session.server";
import { useState } from "react";
import { isUserAdmin } from "./utils/user.server";

export async function action({ request }: ActionFunctionArgs) {
  return signOut(request);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await getUserSession(request);
  return {sessionUser: sessionUser, isAdmin: sessionUser ? await isUserAdmin(sessionUser.email as string) as boolean : false};
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>()
  const isLoggedIn = loaderData.sessionUser
  const isAdmin = loaderData.isAdmin
  const [isMenuClicked, setIsMenuClicked] = useState(false)

  function handleMenuClicked(){
    setIsMenuClicked(!isMenuClicked)
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <header className="sticky top-0 h-[90px] shadow-xl z-30 bg-white lg:flex lg:items-center">
          <div className="flex justify-between items-center w-full py-[13px] sm:py-[25px] md:py-[26px]">    
            <div className="flex w-[70vw] justify-start items-center">
              <div className="flex justify-center items-center sm:w-[40vw] md:w-[25vw] lg:[20vw] xl:w-[15vw] 2xl:w-[10vw] ml-4">
                <NavLink 
                  to="/" 
                  preventScrollReset
                  className="text-3xl flex justify-center mx-auto w-[38vw]"
                >
                  {SalonName}
                </NavLink>
              </div>
              {/* Main Navigation */}
              <div className="hidden lg:flex justify-start items-center sm:w-[10vw] md:w-[40vw] lg:[50vw] xl:w-[50vw] 2xl:w-[60vw] ml-10">
                <nav id="main-navigation">
                  <ul className="flex justify-start">
                    {isLoggedIn && (
                      <li className="nav-item w-[13vw] 2xl:w-[8vw]">
                        <NavLink preventScrollReset to="/profile" className="p-4 flex justify-center">Profile</NavLink>
                      </li>
                    )}
                    {isLoggedIn && !isAdmin && (
                      <li className="nav-item w-[13vw] 2xl:w-[8vw]">
                        <NavLink preventScrollReset to="/reservation" className="p-4 flex justify-center">Reservation</NavLink>
                      </li>
                    )}
                    {isLoggedIn && !isAdmin && (
                      <li className="nav-item w-[13vw] 2xl:w-[8vw]">
                        <NavLink preventScrollReset to="/review_us" className="p-4 flex justify-center">Review Us</NavLink>
                      </li>
                    )}
                    {isLoggedIn && isAdmin && (
                      <li className="nav-item w-[13vw] 2xl:w-[8vw]">
                        <NavLink preventScrollReset to="/salon_services" className="p-4 flex justify-center">Services</NavLink>
                      </li>
                    )}
                    {isLoggedIn && isAdmin && (
                      <li className="nav-item w-[13vw] 2xl:w-[8vw]">
                        <NavLink preventScrollReset to="/branch" className="p-4 flex justify-center">Branches</NavLink>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
            {/* Sign Up | Login */}
            <div className="hidden lg:flex justify-end w-[30vw]">
              <nav id="login" className="flex justify-end w-[20vw]">
                {isLoggedIn ? (
                  <Form method="post" className="flex justify-center nav-item sm:w-[25vw] lg:w-[10vw]">
                    <button type="submit">Sign Out</button>
                  </Form>
                ) : (
                  <ul className="flex w-[30vw] justify-around">
                    <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                        <NavLink preventScrollReset to="/signup">Sign Up</NavLink>
                    </li>
                    <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                        <NavLink preventScrollReset to="/login">Login</NavLink>
                    </li>
                  </ul>
                )}
              </nav>
            </div>
            <div className="lg:hidden flex justify-end pr-5 w-[30vw]">
              <button onClick={handleMenuClicked} className="hover:text-accent">Menu</button>
            </div>
          </div>
          <div hidden={!isMenuClicked} className="container">
            <nav>
              <ul className="fixed w-[35vw] bg-white overflow-hidden border-t top-[90px] right-4 flex lg:hidden flex-col items-end gap-4 rounded-b-xl">
                {isLoggedIn && (
                  <li className="nav-item">
                    <NavLink onClick={handleMenuClicked} preventScrollReset to="/Profile" className="pr-4">Profile</NavLink>
                  </li>
                )}
                {isLoggedIn && !isAdmin && (
                  <li className="nav-item">
                    <NavLink onClick={handleMenuClicked} preventScrollReset to="/reservation" className="pr-4">Reservation</NavLink>
                  </li>
                )}
                {isLoggedIn && !isAdmin && (
                  <li className="nav-item">
                    <NavLink onClick={handleMenuClicked}  preventScrollReset to="/review_us" className="pr-4">Review Us</NavLink>
                  </li>
                )}
                {isLoggedIn && isAdmin && (
                  <li className="nav-item">
                    <NavLink onClick={handleMenuClicked}  preventScrollReset to="/salon_services" className="pr-4">Services</NavLink>
                  </li>
                )}
                {isLoggedIn && isAdmin && (
                  <li className="nav-item">
                    <NavLink onClick={handleMenuClicked}  preventScrollReset to="/branch" className="pr-4">Branches</NavLink>
                  </li>
                )}
                {isLoggedIn && (
                  <Form method="post" className="nav-item pr-4">
                    <button onClick={handleMenuClicked}  type="submit" className="hover:text-accent">Sign Out</button>
                  </Form>
                )}
                {!isLoggedIn && (
                  <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                      <NavLink onClick={handleMenuClicked}  preventScrollReset to="/signup">Sign Up</NavLink>
                  </li>
                )}
                {!isLoggedIn && (
                  <li className="flex justify-center nav-item sm:w-[15vw] lg:w-[8vw]">
                      <NavLink onClick={handleMenuClicked}  preventScrollReset to="/login">Login</NavLink>
                  </li>
                )}

              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-[1920px] mx-auto pb-[10vh] bg-white overflow-hidden">
          {children}
        </main>
        <MainFooter />
        <ScrollRestoration getKey={(location) => {
          return location.pathname
        }} />
        <Scripts />
        <script defer src="./scripts/scrollreveal.min.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com"
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Jost:ital,wght@0,100..900;1,100..900&display=swap",
    }
  ]
}
