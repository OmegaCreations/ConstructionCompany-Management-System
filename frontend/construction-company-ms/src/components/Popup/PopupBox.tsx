import style from "./PopupBox.module.css";

interface PopupProps {
  responseData: object | null;
  setResponseData: any;
}

const PopupBox: React.FC<PopupProps> = ({ responseData, setResponseData }) => {
  return (
    <div className={`${style.popup}`}>
      {responseData &&
        Object.entries(responseData).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {(value as unknown as string).toString()}
          </div>
        ))}
      <button onClick={() => setResponseData({})}>Zamknij</button>
    </div>
  );
};

export default PopupBox;
