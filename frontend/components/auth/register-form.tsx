"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

import { register } from "@/services/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function RegisterForm() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("FLEET_MANAGER");

  const [error,setError] = useState("");



  const handleSubmit = async(
    e:React.FormEvent<HTMLFormElement>
  )=>{

    e.preventDefault();

    try{

      setError("");

      const data = await register(
        name,
        email,
        password,
        role
      );


      localStorage.setItem(
        "token",
        data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      router.push("/dashboard");


    }catch(err:any){

      setError(
        err.message || "Registration failed"
      );

    }

  };



  return (

    <Card className="w-full max-w-md border-slate-200 shadow-lg">

      <CardContent className="p-8">


        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register for TransitOps platform
          </p>

        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <div className="space-y-2">

            <Label>Name</Label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <Input
                className="pl-10 h-11"
                placeholder="John Doe"
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
                required
              />

            </div>

          </div>



          <div className="space-y-2">

            <Label>Email</Label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <Input
                type="email"
                className="pl-10 h-11"
                placeholder="manager@transitops.io"
                value={email}
                onChange={(e)=>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>



          <div className="space-y-2">

            <Label>Password</Label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <Input
                type="password"
                className="pl-10 h-11"
                placeholder="********"
                value={password}
                onChange={(e)=>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </div>



          <div className="space-y-2">

            <Label>Role</Label>

            <div className="relative">

              <BadgeCheck
                size={18}
                className="absolute left-3 top-3 z-10 text-slate-400"
              />


              <Select
                value={role}
                onValueChange={setRole}
              >

                <SelectTrigger className="pl-10 h-11">

                  <SelectValue/>

                </SelectTrigger>


                <SelectContent>

                  <SelectItem value="FLEET_MANAGER">
                    Fleet Manager
                  </SelectItem>

                  <SelectItem value="DISPATCHER">
                    Dispatcher
                  </SelectItem>

                  <SelectItem value="SAFETY_OFFICER">
                    Safety Officer
                  </SelectItem>

                  <SelectItem value="FINANCIAL_ANALYST">
                    Financial Analyst
                  </SelectItem>

                </SelectContent>


              </Select>


            </div>

          </div>




          <Button
            type="submit"
            className="h-11 w-full bg-yellow-500 text-slate-900 hover:bg-yellow-600"
          >

            Create Account

          </Button>



          {
            error && (

              <div className="flex gap-3 rounded-lg border border-red-300 bg-red-50 p-4">

                <AlertCircle
                  size={20}
                  className="text-red-600"
                />

                <p className="text-sm text-red-700">
                  {error}
                </p>

              </div>

            )
          }



        </form>



        <p className="mt-6 text-center text-sm text-slate-500">

          Already have an account?{" "}

          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>

        </p>



      </CardContent>

    </Card>

  );
}