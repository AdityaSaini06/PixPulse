import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useForm} from 'react-hook-form'
import { SignUpValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link , useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";


const SignupForm = () => {
  const {toast} = useToast();
  const navigate = useNavigate();
  const { checkAuthUser,isLoading: isUserLoading} = useUserContext()

  const {mutateAsync : createUserAccount , isPending: isCreatingUser } = 
  useCreateUserAccount() ; 
   
   const {mutateAsync:signInAccount,isPending: isSigningIn} = useSignInAccount() ;

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email : "" ,
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values);
    console.log(newUser);
    if(!newUser) return toast({
      title : "Sign up failed. Please try again"
    })

    const session = await signInAccount({
      email:values.email,
      password:values.password
    })

    if(!session){
      return toast({title:"Sign up failed. Please try again."})
    }


    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn){
        form.reset();
        navigate('/');

    }
    else
       toast({ title: "Sign up failed. Please try again." });
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex  items-center h3-bold">
          <img src="/assets/icons/favicon.ico" alt="logo" />
          &nbsp;PixPulse
        </div>
        <h2 className="h3-bold md:h2-bold pt-5 ">Create a new account</h2>
        <p className="text-light-3 small-medium mt-2 ">
          To use PixPulse , please enter your account details.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col g-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary mt-5">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign-up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-4">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignupForm