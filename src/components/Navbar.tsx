"use client";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HandMetal } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [token, setToken] = useState<string>("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/sign-in";
  };

  useEffect(() => {
    const current_token = localStorage.getItem("token");
    setToken(current_token!);
  }, []);

  return (
    <div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <div className="row">
            <HandMetal />
            <Image src="/assets/logo.png" alt="Campus Quest" height={40} width={40} />
          </div>
        </Link>

        {token ? (
          <button onClick={logout} className={buttonVariants()}>
            Se déconnecter
          </button>
        ) : (
          <Link className={buttonVariants()} href="/sign-in">
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
