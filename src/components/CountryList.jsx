import { useCities } from "../Context/CititesContext.jsx";
import CountryItem from "./CountryItem.jsx";
import styles from "./CountryList.module.css";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  }
  if (!cities.length) {
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  }
  //create a new array which only contains the ones where the city name is unique.

  //loops over cities[] and keeps constructing countries[] which starts at [] empty and ,in each iteration it asks,if array includes current city,  if not then we add the new object which contains current country and the emoji.
  const countries = cities.reduce((accArr, currCity) => {
    if (!accArr.map((el) => el.country).includes(currCity.country)) {
      return [...accArr, { country: currCity.country, emoji: currCity.emoji }];
    } else {
      return accArr;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
