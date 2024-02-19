"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QrReader from "react-qr-reader";
import axios from "axios";
import { DO_QUEST, GET_QUEST } from "@/lib/constants";
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";
import { buttonVariants } from "@/components/ui/button";
import { ThemeProvider } from "../context/ThemeContext";

const Home: React.FC = () => {
  const [appLoaded, setAppLoaded] = useState(false);
  const [questId, setQuestId] = useState("");
  const [questTitle, setQuestTitle] = useState("");
  const [questLibelle, setQuestLibelle] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [qrData, setQrData] = useState("Aucun code pour le moment.");
  const [modalIsOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const qrRef = useRef(null);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
    }
    setAppLoaded(true);
    handleGetLocation();
  }, [router]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude.toString() + "," + longitude.toString());
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDp0YPClQ7N4h2sOzuzChSmMWajpUC0OIo`
            );

            if (response.data.results.length > 0) {
              setAddress(response.data.results[0].formatted_address);
            } else {
              setAddress("Address not found");
            }
          } catch (error) {
            console.error("Error getting address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  };

  const handleScan = async (data: string | null) => {
    if (data) {
      setQrData(data);
      var token = localStorage.getItem("token");
      const response = await axios.get(GET_QUEST + data, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200 && response.data.length > 0) {
        setQuestId(response.data[0].id);
        setQuestTitle(response.data[0].title);
        setQuestLibelle(response.data[0].libelle);
        openModal();
        toast.success("À vous de jouer.");
      } else {
        toast.error("Impossible de récupérer cette quête.");
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    console.log("close");
    setIsOpen(false);
  };

  const acceptQuest = async () => {
    console.log("accept");
    var token = localStorage.getItem("token");
    var userId = localStorage.getItem("userId");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    };
    const response = await axios.post(
      DO_QUEST,
      {
        quest_id: questId,
        user_id: userId,
        status: "En cours",
      },
      { headers }
    );
    if (response.status === 201) {
      toast.success("Quête acceptée.");
    } else if (response.status === 200) {
      toast.error(response.data.error);
    } else {
      toast.error("Impossible d'accepter cette quête.");
    }
    closeModal();
  };

  return (
    <ThemeProvider>
      <div className="container">
        {!appLoaded ? (
          <div>
            <div className="text-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Chargement...</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <br />
            <h1 className="text-3xl">
              Scanner un code QR pour commencer une quête.
            </h1>
            <br />
            <QrReader
              delay={300}
              onScan={handleScan}
              onError={handleError}
              facingMode="environment"
              ref={qrRef}
            />
            <p>Code scanné: {qrData}</p>

            {location && (
              <div>
                <h2 className="text-2xl">Votre position:</h2>
                <p>{address}</p>
              </div>
            )}
            <br />
            <button
              onClick={() => router.push("/quests")}
              className={buttonVariants()}
            >
              Voir mes quêtes
            </button>
            <br />
            {modalIsOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h2>******** {questTitle} ********</h2>
                  <div>{questLibelle}</div>
                  <br />
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        acceptQuest();
                      }}
                      className={buttonVariants()}
                    >
                      Commencer
                    </button>
                    <button
                      onClick={() => {
                        closeModal();
                      }}
                      className={buttonVariants()}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
            <style jsx>{`
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }

              .modal {
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              }

              .close {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
              }
            `}</style>
            <Toaster />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Home;
