import { Outlet , Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAutheticated = false ; 


  return (
    <>
    {isAutheticated ? (
      <Navigate to= "/"/>
    ):(
      <>
      <section className="flex flex-1 justify-center items-center flex-col 
      py-10">
        <Outlet/>
      </section>
      </>
    )}
    </>
  )
}

export default AuthLayout