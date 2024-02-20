"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { REGISTER } from "@/lib/constants";
import toast, { Toaster } from 'react-hot-toast';

const FormSchema = z
  .object({
    username: z.string().min(1, "Le nom est requis.").max(100),
    email: z
      .string()
      .min(1, "L'adresse email est requise.")
      .email("Adresse email invalide."),
    password: z
      .string()
      .min(1, "Le mot de passe est requis.")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z
      .string()
      .min(1, "Le mot de passe de confirmation est requis."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas.",
  });

const SignUpForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    //request to api and routing to home page
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(REGISTER, values, { headers });
      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem("user", JSON.stringify(values));
        toast.success("Inscription réussie. Bienvenue.");
        //wait 2 seconds before redirecting to home page
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }else{
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom et prénoms</FormLabel>
                <FormControl>
                  <Input placeholder="ESIAKU Dieudonné" {...field} />
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
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez à nouveau votre mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">
          Créer un compte
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        Ou
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Vous avez déjà un compte? 
        <Link className="text-blue-500 hover:underline" href="/sign-in">
          Connectez-vous.
        </Link>
      </p>
      <Toaster/>
    </Form>
  );
};

export default SignUpForm;
