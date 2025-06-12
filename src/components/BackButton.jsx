import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e) => {
        //we need to preventDefault the form Since the form gets submitted on btn click
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; back
    </Button>
  );
}

export default BackButton;
