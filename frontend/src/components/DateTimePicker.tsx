import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const DateTimePicker = ({ value, onChange }: Props) => {
  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="Pp"
      placeholderText="Pick a date & time"
      className="border rounded p-2 w-full"
    />
  );
};

export default DateTimePicker;
