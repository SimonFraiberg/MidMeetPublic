import React from "react";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import Dropdown from "react-bootstrap/Dropdown";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "./field.css";
import { Form } from "react-bootstrap";

type LocationProp = {
  setLocation: React.Dispatch<
    React.SetStateAction<{
      address: string;
      lng: number;
      lat: number;
    }>
  >;
};
const libraries: Libraries = ["places"];

export default function LocationInput({ setLocation }: LocationProp) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE,
    libraries: libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div className="places-container">
      <PlacesAutocomplete setLocation={setLocation} />
    </div>
  );
}

const PlacesAutocomplete = ({ setLocation }: LocationProp) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setLocation({ address, lat, lng });
  };

  return (
    <>
      <Form.Group className="field">
        <Form.Label htmlFor="location"> Address</Form.Label>
        <Form.Control
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Default address"
          required={true}
        />
      </Form.Group>
      {status === "OK" && (
        <Dropdown.Menu show={data.length > 0} className="suggestions">
          {data.map(({ place_id, description }) => (
            <Dropdown.Item
              onClick={() => handleSelect(description)}
              key={place_id}
            >
              {description}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </>
  );
};
