"use client";
import Form from "next/form";
import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { TrolleyIcon } from "@sanity/icons";
import useBasketStore from "../../../store/store";

function Header() {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href={"/"}
          className="md:text-2xl  text-xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          Shopr
        </Link>

        <Form
          action={"/search"}
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-black text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-blue-500 w-full max-w-4xl"
          />
        </Form>

        <div className="flex items-center md:space-x-4 space-x-2  mt-4 sm:mt-0 flex-1 md:flex-none">
          <Link
            href={"/basket"}
            className="flex-1 relative flex justify-center  sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <TrolleyIcon className="size-6" />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
            <span className="text-xs  md:text-base">My Basket</span>
          </Link>
          {/* user area*/}
          <ClerkLoaded>
            {user && (
              <Link
                href={"/orders"}
                className="flex-1  relative flex justify-center   sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 py-3  px-4 rounded"
              >
                <span className="text-xs  md:text-base">My Orders</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton/>
                <div className="hidden md:block text-xs">
                  <p className="text-gray-100">Welcome Back</p>
                  <p className="font-bold text-white">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <span className="text-white cursor-pointer font-bold">
                Sign In
                </span>
              </SignInButton>
            )}

          
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default Header;
