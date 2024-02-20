"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { CONTACT_US } from "@/lib/constants";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const { name, email, message } = formData;
    // axios.post(CONTACT_US, { name, email, message });
    toast.success("Message envoyé. On vous répondra bientôt.");
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <Head>
        <title>Contact</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4 text-center">Contactez-nous.</h1>
      <p className="text-center">
        Vous avez des questions ou des suggestions? Envoyez-nous un message.
      </p>
      <div
        className="flex justify-center"
        style={{ borderRadius: "5px", overflow: "hidden" }}
      >
        <Image
          src="/assets/contact-us.png"
          alt="Campus Quest"
          height={300}
          width={300}
          layout="fixed"
          className="rounded-full"
        />
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Envoyer
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default ContactPage;
