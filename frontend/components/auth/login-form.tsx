"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import FooterGallery from "./footer-gallery";

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

import AccessScope from "./access-scope";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("dispatcher");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(true);

    console.log({
      email,
      password,
      role,
      remember,
    });

    // Backend Integration Later
    // await login(...)
  };

  return (
    <div className="space-y-6">

      <Card className="border-slate-200 shadow-lg">

        <CardContent className="p-8">

          {/* Heading */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-900">

              Sign in to your account

            </h1>

            <p className="mt-2 text-sm text-slate-500">

              Enter your credentials to continue

            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Email */}

            <div className="space-y-2">

              <Label>Email Address</Label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <Input
                  type="email"
                  placeholder="manager@transitops.io"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* Password */}

            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <Label>Password</Label>

                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

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
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {/* Role */}

            <div className="space-y-2">

              <Label>Role Access</Label>

              <div className="relative">

                <BadgeCheck
                  size={18}
                  className="absolute left-3 top-3 z-20 text-slate-400"
                />

                <Select
  value={role}
  onValueChange={(value: string) => setRole(value)}
>
  <SelectTrigger className="pl-10 h-11">
    <SelectValue placeholder="Select Role" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="fleet">Fleet Manager</SelectItem>
    <SelectItem value="dispatcher">Dispatcher</SelectItem>
    <SelectItem value="safety">Safety Officer</SelectItem>
    <SelectItem value="finance">Financial Analyst</SelectItem>
  </SelectContent>
</Select>

              </div>

            </div>

            {/* Remember */}

            <div className="flex items-center space-x-3">

              <Checkbox
                checked={remember}
                onCheckedChange={(checked) =>
                  setRemember(!!checked)
                }
              />

              <Label className="font-normal">

                Remember this device for 30 days

              </Label>

            </div>

            {/* Button */}

            <Button
              type="submit"
              className="h-11 w-full bg-yellow-500 text-slate-900 hover:bg-yellow-600"
            >
              Sign In
            </Button>

            {/* Error */}

            {error && (

              <div className="flex gap-3 rounded-lg border border-red-300 bg-red-50 p-4">

                <AlertCircle
                  className="text-red-600"
                  size={20}
                />

                <div>

                  <p className="font-semibold text-red-700">

                    Invalid Credentials

                  </p>

                  <p className="text-sm text-red-600">

                    Account locked after 5 failed attempts.

                  </p>

                </div>

              </div>

            )}

          </form>

          <AccessScope />

        </CardContent>
        <FooterGallery />

      </Card>

    </div>
  );
}