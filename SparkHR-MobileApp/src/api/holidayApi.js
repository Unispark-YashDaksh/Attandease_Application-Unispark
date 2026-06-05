import axios from "axios";

const fetchHolidays = async () => {
  try {
    const response = await axios.get(
      "http://localhost:7000/fetch-holidays"
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