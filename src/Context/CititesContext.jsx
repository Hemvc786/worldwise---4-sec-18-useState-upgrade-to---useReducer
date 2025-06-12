import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

//reducer need to be pure functions-->so we cannot make api requests inside reducer fuunctions,what we can do is make fetch requests in separate functions and after the data has been received we can dispatch in actions to the reducer,
//when we use reducer iin large appln its very important to follow the meaningful naming conventions, when it comes to action.types, it is good idea to model these actions as events and not as setters,  eg. it shouldnt be "setCities" it should be cities/loaded
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

//contains all the functions that are responsible for updating the state related to cities.
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [currentCity, setCurrentCity] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;

  useEffect(function () {
    dispatch({ type: "loading" });
    async function fetchCities() {
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was a error loading cities",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    //anything coming from url is a string
    if (Number(id) === currentCity.id) {
      return;
    }
    dispatch({ type: "loading" });

    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was a error loading city",
      });
    }
  }

  //--------------------
  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      //since we are making POST request so we add the options object in fetch() method--->this POST request will update the server state.
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity), //newCity converted to JSON string
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      //we are gonna keep application state in sync with  the state from UI.in other words keep UI state in sync with remote state.
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was a error creating the city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      //since we are making POST request so we add the options object in fetch() method--->this POST request will update the server state.
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was a error deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {" "}
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext was used outside the cities provider");
  }
  return context;
}

export { CitiesProvider, useCities };
