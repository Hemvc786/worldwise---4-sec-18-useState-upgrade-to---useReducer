import { useNavigate, useSearchParams } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeolocation";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../Context/CititesContext";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const navigate = useNavigate(); //rets a function
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  //display city markers on map-->need to access city in Map component
  const { cities } = useCities();

  const [mapPosition, setMapPosition] = useState([40, 0]);

  useEffect(
    function () {
      if (mapLat && mapLng) {
        //if these value exist then only do this
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );

  return (
    // here in navigate("form") --> we are navigating to the 'form' URL.
    //Imperative way to navigating to the component
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        // center={[
        //   mapLat ? Number(mapLat) : mapPosition[0],
        //   mapLng ? Number(mapLng) : mapPosition[1],
        // ]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap(); //to get current instance of the map i.e currently being displayed...
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigatee = useNavigate(); //rets a function

  useMapEvents({
    click: (e) => {
      console.log(e);
      navigatee(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
