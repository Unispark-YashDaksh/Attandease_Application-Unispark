import axios from "axios";
import {
  VITE_API
} from "@env";

const fetchHolidays = async () => {
  try {
    const response = await axios.get(
      `${VITE_API}/fetch-holidays`
    );

    const holidayArr = [];

    response.data.result.forEach((item) => {
      const formattedDate = new Date(item.holiday_date)
        .toISOString()
        .split("T")[0];

      holidayArr.push({
        date: formattedDate,
        name: item.holiday_name,
      });
    });

    return holidayArr;

  } catch (err) {
    console.log(err);
    return [];
  }
};

export default fetchHolidays;