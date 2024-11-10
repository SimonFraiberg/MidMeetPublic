import "./button.css";

type ButtonProps = {
  name: string;
  className: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

function Button(props: ButtonProps) {
  return (
    <button
      className={`${props.className} `}
      type="submit"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.name}
    </button>
  );
}

export default Button;
