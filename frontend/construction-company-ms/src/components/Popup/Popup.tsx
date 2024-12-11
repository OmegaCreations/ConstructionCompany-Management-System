interface PopupProps {
  type: string;
  text: string;
}

const Popup: React.FC<PopupProps> = ({ type, text }) => {
  let color;
  switch (type) {
    case "error":
      color = "red";
      break;
    case "info":
      color = "blue";
      break;
    case "success":
      color = "green";
  }

  return <div style={{ backgroundColor: color }}>{text}</div>;
};

export default Popup;
