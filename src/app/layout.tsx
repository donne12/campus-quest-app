"use client";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pusher = new Pusher("b960c33e2dbebee9a340", {
    cluster: "eu",
  });
  const { systemTheme, theme, setTheme } = useTheme();

  const Notifications = () => {
    const [notifications, setNotifications] = useState<any[]>([]); // Add type annotation for notifications

    useEffect(() => {
      //pusher configuration
      const channel = pusher.subscribe("my-channel");
      channel.bind("my-event", (data: any) => {
        setNotifications([...notifications, data]);
      });
      return () => {
        pusher.unsubscribe("my-channel");
      };
    }, [notifications]);
  };

  return (
    <html lang="fr">
      <head>
        <title>Campus Quest</title>
      </head>
      <body className={inter.className}>
        <main className="w-full h-screen flex flex-col justify-center items-center">
          <Navbar />
          {children}
        </main>
        <footer className="bg-gray-200 py-4 text-center">
          <p>
            ©{new Date().getFullYear()} ESIAKU K. Dieudonné, Tous droits
            réservés.
          </p>
          <br />
        </footer>
      </body>
    </html>
  );
}
