import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./tailwind.css?url";
import MainHeader from "./components/MainHeader";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <MainHeader />
        <main className="max-w-[1920px] mx-auto bg-white overflow-hidden">
          {children}
        </main>
        <ScrollRestoration />
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
