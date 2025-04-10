"use client"
import { NextUIProvider } from "@nextui-org/react"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import Header from "./_components/Header"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@clerk/nextjs"
import { UserDetailContext } from "./_context/UserDetailConext"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { createUser, getUser, UserInsertProps } from "./_utils/db"

export default function Provider({ children }: { children: ReactNode }) {
  const [userDetail, setUserDetail] = useState<UserInsertProps | null>(null)
  const { user } = useUser()

  const saveNewUserIfNotExist = useCallback(async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress

    const foundUser = userEmail ? await getUser(userEmail) : null

    console.log("ExistingUser", foundUser)

    if (foundUser) {
      setUserDetail(foundUser)
      return
    }

    // if Not will add new user to db

    const result = await createUser(
      user?.primaryEmailAddress?.emailAddress,
      user?.imageUrl,
      user?.fullName
    )

    console.log("new User", result)

    setUserDetail(result)
  }, [user?.fullName, user?.imageUrl, user?.primaryEmailAddress?.emailAddress])

  useEffect(() => {
    if (user) {
      saveNewUserIfNotExist()
    }
  }, [saveNewUserIfNotExist, user])

  const value = useMemo(
    () => ({
      userDetail,
      setUserDetail,
    }),
    [userDetail, setUserDetail]
  )

  return (
    <UserDetailContext.Provider value={value}>
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "" }}
      >
        <NextUIProvider>
          <Header />
          {children}
          <ToastContainer />
        </NextUIProvider>
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  )
}
