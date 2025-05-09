"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}
const getCountryCode = () => {
  const path = usePathname()
  const pathParts = path.split("/")
  const countryCode = pathParts[1]
  return countryCode
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const countryCode = getCountryCode()
  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} countryCode={countryCode} />
      ) : (
        <Register setCurrentView={setCurrentView}  countryCode={countryCode} />
      )}
    </div>
  )
}

export default LoginTemplate
