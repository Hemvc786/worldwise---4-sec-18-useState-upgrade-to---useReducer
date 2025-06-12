// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../Context/CititesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  console.log(lat, lng);

  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeoCodingError("");

          if (
            Number(lat) < -90 ||
            Number(lat) > 90 ||
            Number(lng) < -180 ||
            Number(lng) > 180
          ) {
            setGeoCodingError("Coordinates are out of range");
            return;
          }

          if (!lat && !lng) return;

          if (isNaN(lat) || isNaN(lng)) return [null, null];

          const response = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await response.json();
          console.log(data);
          if (!data.countryCode) {
            throw new Error(
              `Doesn't seem to be a city, Click somewhere else😯`
            );
          }
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          // setGeoCodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
          // setIsLoadingGeocoding("");
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  //form gets submitted when one of the btn gets clicked... Add btn in form
  async function handleSubmit(e) {
    e.preventDefault(); //since page will get the hard reload which we dont need.
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    // console.log(newCity);
    await createCity(newCity); //since createCity is an async function which will return a promise , so we await here ----> for which we need to make handleSubmit as "async"
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) {
    return <Spinner />;
  }

  if (geoCodingError) return <Message message={geoCodingError} />;

  //below line is to handle the situation when user goes to /app/form url without the lat and lng parameters in URL...
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere else in the map..." />;

  return (
    <form
      className={`${styles.form} ${isLoading ? "styles.loading" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        {/* navigate(-1) here is he no. of steps we want to go back in the browser history */}
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
