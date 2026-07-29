"use client";

import { useState } from "react";
import { login } from "@/services/auth";
import { setAuth } from "@/lib/auth-token";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

import FooterGallery from "./footer-gallery";
import AccessScope from "./access-scope";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function LoginForm() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DISPATCHER");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      setError(false);

      const data = await login(
        email,
        password
      );


      setAuth(data.token, data.user, remember);

      router.push("/dashboard");


    } catch (err) {

      console.log(err);
      setError(true);

    }

  };


  return (
    <div className="space-y-6">

      <Card className="border-hairline bg-panel shadow-lg">

        <CardContent className="p-8">


          <div className="mb-8">

            <h1 className="text-3xl font-bold text-ink">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm text-ink-dim">
              Enter your credentials to continue
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >


            <div className="space-y-2">

              <Label className="text-ink">Email Address</Label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-ink-dim"
                />

                <Input
                  type="email"
                  placeholder="manager@transitops.io"
                  className="pl-10 h-11 bg-panel-raised border-hairline text-ink"
                  value={email}
                  onChange={(e)=>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>



            <div className="space-y-2">


              <div className="flex justify-between">

                <Label className="text-ink">Password</Label>

                <Link
                  href="#"
                  className="text-sm text-reflect hover:underline"
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-ink-dim"
                />


                <Input
                  type="password"
                  placeholder="********"
                  className="pl-10 h-11 bg-panel-raised border-hairline text-ink"
                  value={password}
                  onChange={(e)=>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>



            <div className="space-y-2">

              <Label className="text-ink">
                Role Access
              </Label>


              <div className="relative">

                <BadgeCheck
                  size={18}
                  className="absolute left-3 top-3 z-20 text-ink-dim"
                />


                <Select
                  value={role}
                  onValueChange={(value) => setRole(value ?? "")}
                >

                  <SelectTrigger className="pl-10 h-11 bg-panel-raised border-hairline text-ink">

                    <SelectValue />

                  </SelectTrigger>


                  <SelectContent className="bg-panel border-hairline text-ink">

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




            <div className="flex items-center space-x-3">


              <Checkbox
                checked={remember}
                onCheckedChange={(checked)=>
                  setRemember(!!checked)
                }
                className="border-hairline"
              />


              <Label className="font-normal text-ink-dim">

                Remember this device for 30 days

              </Label>


            </div>



            <Button
              type="submit"
              className="h-11 w-full"
            >

              Sign In

            </Button>



            {
              error && (

                <div className="flex gap-3 rounded-lg border border-stop/30 bg-stop/10 p-4">


                  <AlertCircle
                    className="text-stop"
                    size={20}
                  />


                  <div>

                    <p className="font-semibold text-stop">
                      Invalid Credentials
                    </p>

                    <p className="text-sm text-stop/80">
                      Please check email and password.
                    </p>

                  </div>


                </div>

              )
            }


          </form>


          <AccessScope />


        </CardContent>


        <FooterGallery />


      </Card>


    </div>
  );
}