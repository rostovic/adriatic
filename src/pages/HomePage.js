import { useEffect, useReducer, useState } from "react";
import { getAccomodationData } from "../api/api";
import classes from "./HomePage.module.css";
import SingleAccomodation from "../components/SingleAccomodation";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.payload.filter]: action.payload.value };
    default:
      return state;
  }
};

const currentState = {
  numOfPeople: "",
  airConditioning: false,
  parkingSpace: false,
  pets: false,
  pool: false,
  wifi: false,
  tv: false,
};

const HomePage = () => {
  const [accomodation, setAccomodation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, currentState);
  const [date, setDate] = useState({ start: null, end: null });

  // console.log(date);

  const getData = async () => {
    const response = await getAccomodationData();
    if (response.status === "success") {
      setAccomodation(response.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleInputChange = (filter, value) => {
    dispatch({
      type: "SET_FILTER",
      payload: { filter, value },
    });
  };

  const handleNumOfPeople = (inputValue) => {
    if (!isNaN(inputValue) && inputValue > 0 && inputValue <= 8) {
      handleInputChange("numOfPeople", inputValue);
    } else {
      handleInputChange("numOfPeople", 1);
    }
  };

  const renderAccomodation = () => {
    if (accomodation === null) return;
    let filteredData = [...accomodation];

    for (const [filter, value] of Object.entries(state)) {
      if (value !== false) {
        filteredData = filteredData.filter((accomodation) =>
          filter === "numOfPeople"
            ? accomodation.capacity >= value
            : accomodation.amenities[filter]
        );
      }
    }

    if (date.start && date.end) {
      filteredData = filteredData.filter((accomodation) =>
        accomodation.availableDates.some((availableDate) => {
          const startDate = new Date(availableDate.intervalStart);
          const endDate = new Date(availableDate.intervalEnd);

          return startDate <= date.end && endDate >= date.start;
        })
      );
    }

    return filteredData.map((data) => (
      <SingleAccomodation data={data} key={data.id} />
    ));
  };

  const renderFilterCheckbox = (label, filterName) => {
    return (
      <div className={classes.amenityDiv}>
        <input
          type="checkbox"
          className={classes.checkBox}
          onChange={() => handleInputChange(filterName, !state[filterName])}
        />
        <label className={classes.amenityLabel}>{label}</label>
      </div>
    );
  };

  const renderFilters = () => {
    return (
      <div className={classes.filterDiv}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div>
            <input
              type="date"
              min="2024-01-01"
              max="2024-12-31"
              onChange={(e) => setDate({ start: new Date(e.target.value) })}
            />
            <label> to </label>
            <input
              type="date"
              min="2024-01-01"
              max="2024-12-31"
              onChange={(e) =>
                setDate({ ...date, end: new Date(e.target.value) })
              }
            />
          </div>
          <div className={classes.amenityDiv}>
            <input
              type="number"
              style={{ width: "1.75rem" }}
              max="8"
              value={state.numOfPeople}
              onChange={(e) => handleNumOfPeople(+e.target.value)}
            />
            <label className={classes.amenityLabel}>Num. of people:</label>
          </div>
          {renderFilterCheckbox("Television", "tv")}
          {renderFilterCheckbox("Air conditioning", "airConditioning")}
          {renderFilterCheckbox("Parking space", "parkingSpace")}
          {renderFilterCheckbox("Pets", "pets")}
          {renderFilterCheckbox("Pool", "pool")}
          {renderFilterCheckbox("Wifi", "wifi")}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={classes.loaderContainer}>
        <div className={classes.loader} />
      </div>
    );
  }

  if (accomodation === null) {
    return (
      <div>
        <p>No accomodation found! Try again later!</p>
      </div>
    );
  }

  return (
    <div className={classes.mainLayout}>
      {renderFilters()}
      {renderAccomodation()}
    </div>
  );
};

export default HomePage;
