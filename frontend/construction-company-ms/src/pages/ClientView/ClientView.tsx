import React, { useState } from "react";
import { endpoint } from "../../utils/endpoints";
import style from "./ClientView.module.css";
import Loading from "../../components/Loading/Loading";

interface Order {
  wycena: number;
  zlecenie_id: number;
  opis: string;
  data_zlozenia: string;
  data_rozpoczecia: string;
  data_zakonczenia: string | null;
  lokalizacja: string;
}

interface ClientData {
  klient_id: number;
  imie: string;
  nazwisko: string;
  firma: string;
  telefon: string;
  email: string;
  adres: string;
}

interface ClientResponse {
  client: ClientData;
  orders: Order[];
}

const ClientView: React.FC = () => {
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<ClientResponse | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      setError("Proszę podać adres e-mail.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        endpoint.CLIENT_GET_AS_CLIENT(String(token)),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Błąd podczas pobierania danych.");
      }

      const data: ClientResponse = await response.json();
      setClientData(data); // Zapisanie danych klienta w stanie
    } catch (err) {
      setError("Wystąpił błąd z serwera. Proszę spróbować ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={style.clientSection}>
      {!clientData ? (
        <>
          <h1>Witamy, podaj mail, na który otrzymali Państwo ten link</h1>
          <input
            type="email"
            className={style.clientInput}
            placeholder="Wpisz swój adres e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} // Zablokowanie inputa podczas ładowania
          />
          <button
            className={style.clientSumbit}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : "Zatwierdź"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <div>
          <h2>Dane klienta</h2>
          <p>
            <strong>Imię:</strong> {clientData.client.imie}
          </p>
          <p>
            <strong>Nazwisko:</strong> {clientData.client.nazwisko}
          </p>
          <p>
            <strong>Firma:</strong> {clientData.client.firma}
          </p>
          <p>
            <strong>Telefon:</strong> {clientData.client.telefon}
          </p>
          <p>
            <strong>Email:</strong> {clientData.client.email}
          </p>
          <p>
            <strong>Adres:</strong> {clientData.client.adres}
          </p>

          <h3>Zlecenia</h3>
          {clientData.orders.length > 0 ? (
            <ul>
              {clientData.orders.map((order, idx) => (
                <li key={idx}>
                  <h4
                    style={{ color: order.data_zakonczenia ? "green" : "red" }}
                  >
                    Zlecenie{" "}
                    {order.data_zakonczenia ? "[ukończone]" : "[nieukończone]"}
                  </h4>
                  <p style={{ color: "blue" }}>
                    <strong>Wycena:</strong> {order.wycena}
                  </p>
                  <p>
                    <strong>Opis:</strong> {order.opis}
                  </p>
                  <p>
                    <strong>Data złożenia:</strong> {order.data_zlozenia}
                  </p>
                  <p>
                    <strong>Data rozpoczęcia:</strong> {order.data_rozpoczecia}
                  </p>
                  <p>
                    <strong>Data zakończenia:</strong>{" "}
                    {order.data_zakonczenia ?? "Brak"}
                  </p>
                  <p>
                    <strong>Lokalizacja:</strong> {order.lokalizacja}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak zleceń.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ClientView;
