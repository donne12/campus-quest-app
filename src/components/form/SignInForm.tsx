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
import axios from 'axios';
import { LOGIN } from "@/lib/constants";
import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast.success('Connexion réussie. Bienvenue.');

const FormSchema = z.object({
  email: z.string().min(1, "Adresse email requise.").email("Adresse email invalide."),
  password: z
    .string()
    .min(1, "Le mot de passe est requis.")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

const SignInForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    //api request for login
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(LOGIN, values, { headers });
      if(response.status === 200){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(values));
        notify();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }else{
        toast.error(response.data.error);
      }
     } catch (error) {
      console.error('Erreur de connexion :', error);
      toast.error('Erreur de connexion.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
        </div>
        <Button className="w-full mt-6" type="submit">
          Se connecter
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        Ou
      </div>

      <p className="text-center text-sm text-gray-600 mt-2">
        Vous n&apos;avez pas encore de compte?
        <Link className="text-blue-500 hover:underline" href="/sign-up">
          Créer en un.
        </Link>
      </p>
      <Toaster/>
    </Form>
  );
};

export default SignInForm;
