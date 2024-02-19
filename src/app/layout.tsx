"use client"
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import {useState, useEffect } from "react";
import Pusher from 'pusher-js';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pusher = new Pusher("b960c33e2dbebee9a340", {
    cluster: "eu",
  });
  
  const Notifications = () => {
    const [notifications, setNotifications] = useState<any[]>([]); // Add type annotation for notifications
  
    useEffect(() => {
      const channel = pusher.subscribe("my-channel");
  
      channel.bind("my-event", (data: any) => {
        setNotifications([...notifications, data]);
      });
  
      return () => {
        pusher.unsubscribe("my-channel");
      };
    }, [notifications]);
  }

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
      </body>
    </html>
  );
}
