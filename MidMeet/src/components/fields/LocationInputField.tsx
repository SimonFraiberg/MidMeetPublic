import React, { useState } from "react";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import Dropdown from "react-bootstrap/Dropdown";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "./field.css";
import { Form } from "react-bootstrap";

type LocationProp = {
  setLocation: (field: string, value: any, shouldValidate?: boolean) => void;
};
const libraries: Libraries = ["places"];
export default function LocationInputField({ setLocation }: LocationProp) {
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
  const [focused, setFocused] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const handleFocus = () => {
    setFocused(true);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "") {
      setIsInputValid(false);
    } else setIsInputValid(true);
    setValue(input);
  };
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
    const { lat, lng } = getLatLng(results[0]);
    setLocation("location", { address, lat, lng });
    setIsInputValid(true);
  };

  return (
    <>
      <Form.Group className="field">
        <Form.Label htmlFor="location"> Address</Form.Label>
        <Form.Control
          name="location"
          value={value}
          onChange={handleChange}
          disabled={!ready}
          placeholder="Default address"
          required={true}
          onBlur={handleFocus}
          isInvalid={focused && !isInputValid}
          isValid={focused && isInputValid}
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
