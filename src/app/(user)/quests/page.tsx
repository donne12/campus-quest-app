// pages/quests.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { GET_QUESTS, QUEST_DONE } from "@/lib/constants";
import toast, { Toaster } from "react-hot-toast";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const QuestsPage = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    toast.loading("Chargement des quêtes...");
    const fetchQuests = async () => {
      try {
        const response = await axios.get(
          GET_QUESTS + localStorage.getItem("userId"),
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setQuests(response.data);
      } catch (error) {
        console.error("Error fetching quests:", error);
      }
    };
    toast.dismiss();
    fetchQuests();
  }, []);

  const handleCompleteQuest = async (questId: any) => {
    try {
      const response = await axios.post(
        QUEST_DONE,
        {
          quest_id: questId,
          user_id: localStorage.getItem("userId"),
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Quête terminée.");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Impossible de terminer cette quête.");
      }
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  return (
    <div className="container">
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        .quest-item {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
          margin-top: 0;
          font-size: 40px;
        }

        .status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .status.pending {
          background-color: #ffc107;
          color: #333;
        }

        .status.completed {
          background-color: #28a745;
          color: #fff;
        }
      `}</style>
      <h1>Liste des quêtes</h1>
      <ul>
        {quests.map(
          (quest: {
            id: string;
            title: string;
            description: string;
            status: string;
            created_at: string;
          }) => (
            <li key={quest.id} className="quest-item">
              <div className="flex justify-between">
                {" "}
                <h2>{quest.title}</h2>
                <p>
                  {format(new Date(quest.created_at), "dd MMMM yyyy HH:mm:ss", {
                    locale: fr,
                  })}
                </p>
              </div>

              <p>{quest.description}</p>

              <div className="flex justify-between">
                {quest.status == "Terminée" && (
                  <span className="status completed">{quest.status}</span>
                )}
                {quest.status == "En cours" && (
                  <span className="status pending">{quest.status}</span>
                )}

                {quest.status !== "Terminée" && (
                  <button
                    onClick={() => handleCompleteQuest(quest.id)}
                    className={buttonVariants()}
                  >
                    Terminer
                  </button>
                )}
              </div>
            </li>
          )
        )}
      </ul>
      <Toaster />
    </div>
  );
};

export default QuestsPage;
