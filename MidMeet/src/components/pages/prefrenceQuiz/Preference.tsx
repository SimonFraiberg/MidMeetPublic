import "./preference.css";

export type Option = {
  id: number;
  imgSrc: string;
  optionText: string;
  searchAPI?: string;
  clicked: boolean;
};

interface PreferenceProps {
  title: string;
  className?: string;
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

export default function Preference({
  title,
  className,
  options,
  setOptions,
}: PreferenceProps) {
  const handleOptionClick = (id: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, clicked: !option.clicked } : option
      )
    );
  };
  /*
    if (option) {
      setSelectedOptions((prevOptions) => {
        // Check if the option is already selected
        const isSelected = prevOptions.some(
          (selectedOption) => selectedOption === option.optionText
        );

        if (isSelected) {
          // If the option is already selected, remove it
          return prevOptions.filter(
            (selectedOption) => selectedOption !== option.optionText
          );
        } else {
          // If the option is not selected, add it
          return [...prevOptions, option.optionText];
        }
      });
    }
  };
  */
  return (
    <>
      <h2 className="josefin-sans title">{title}</h2>
      <div className={className}>
        {options.map((option, index) => (
          <div
            className={`josefin-sans optionContainer ${
              option.clicked ? "clicked" : ""
            }`}
            key={index}
            style={{ backgroundImage: `url(${option.imgSrc})` }}
            onClick={() => handleOptionClick(option.id)}
          >
            <div className="topCenter">{option.optionText}</div>
          </div>
        ))}
      </div>
    </>
  );
}
