import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  //below here we are reading global state from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  return [lat, lng];
}
