import "./profileImage.css";
import { Image } from "react-bootstrap";
type PictureProps = {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
};

function Picture({ value, set }: PictureProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        set(reader.result as string);
      };
    }
  };

  return (
    <div className="row g-2">
      <div className="form-floating col-10">
        <input
          type="file"
          className="form-control field"
          id="floatingFile"
          placeholder="Picture"
          onChange={onChange}
          required={true}
        ></input>
        <label htmlFor="floatingFile">Picture</label>
        {value && (
          <div>
            <Image
              roundedCircle
              fluid
              className="profileImage"
              src={value}
              alt="Your Image"
            ></Image>
          </div>
        )}
      </div>
    </div>
  );
}

export default Picture;
