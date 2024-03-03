import {
  MdPeopleAlt,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
  MdPets,
} from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { TbBeach } from "react-icons/tb";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaParking, FaWifi } from "react-icons/fa";
import { PiSwimmingPoolLight, PiTelevisionSimpleFill } from "react-icons/pi";
import classes from "./SingleAccomodation.module.css";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formattedDate } from "../functions/helpers";

const SingleAccomodation = ({ data }) => {
  const [expand, setExpand] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);
  const [priceRange, setPriceRange] = useState(null);
  const minDate = new Date("2024-01-01");
  const maxDate = new Date("2024-12-31");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // console.log(data);

  // console.log(startDate);
  // console.log(endDate);

  const isDateDisabled = (date) => {
    return !data.availableDates.some((availableDate) => {
      const startDate = new Date(availableDate.intervalStart);
      const endDate = new Date(availableDate.intervalEnd);
      return date >= startDate && date <= endDate;
    });
  };

  const tileDisabled = ({ date }) => isDateDisabled(date);

  const handleDateChange = (newDate) => {
    if (!startDate) {
      setStartDate(newDate);
      setOpenCalendar(false);
    } else if (!endDate && newDate > startDate) {
      setEndDate(newDate);
      setOpenCalendar(false);
    } else {
      setStartDate(newDate);
      setEndDate(null);
      setOpenCalendar(false);
    }
  };

  useEffect(() => {
    const prices = data.pricelistInEuros.map((entry) => entry.pricePerNight);
    setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
  }, [data]);

  const amenitiesArray = [
    "airConditioning",
    "parkingSpace",
    "pets",
    "pool",
    "tv",
    "wifi",
  ];

  const icons = [
    <TbAirConditioning size={22} />,
    <FaParking size={20} color="blue" />,
    <MdPets size={20} />,
    <PiSwimmingPoolLight size={20} />,
    <PiTelevisionSimpleFill size={20} />,
    <FaWifi size={20} />,
  ];

  const handleShowMoreInformation = () => {
    setExpand((prev) => !prev);
  };

  const renderExpand = () => {
    let content;

    if (!expand) {
      content = <MdOutlineExpandMore />;
    } else {
      content = <MdOutlineExpandLess />;
    }

    return (
      <div className={classes.expandDiv} onClick={handleShowMoreInformation}>
        {content}
      </div>
    );
  };

  const renderBasicInfo = () => {
    let content = null;

    if (data.beachDistanceInMeters !== null) {
      content = (
        <>
          <TbBeach size={20} />
          <span style={{ fontSize: 16 }}>{data.beachDistanceInMeters} m</span>
        </>
      );
    }

    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdPeopleAlt size={20} />
          <div>
            <span style={{ fontSize: 18 }}>{data.capacity} </span>
          </div>
        </div>
        <div className={classes.beachInfoDiv}>{content}</div>
      </div>
    );
  };

  const renderAmenity = (icon, property, icon2, property2, index) => {
    return (
      <div style={{ display: "flex" }} key={index}>
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
          {data.amenities[property] ? (
            <FaCircleCheck size={20} color="green" />
          ) : (
            <FaCircleXmark size={20} color="red" />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon2}
          {data.amenities[property2] ? (
            <FaCircleCheck size={20} color="green" />
          ) : (
            <FaCircleXmark size={20} color="red" />
          )}
        </div>
      </div>
    );
  };

  const renderAmenities = () => {
    if (!expand) return null;

    return (
      <>
        {renderAmenity(
          icons[0],
          amenitiesArray[0],
          icons[1],
          amenitiesArray[1],
          0
        )}
        {renderAmenity(
          icons[2],
          amenitiesArray[2],
          icons[3],
          amenitiesArray[3],
          1
        )}
        {renderAmenity(
          icons[4],
          amenitiesArray[4],
          icons[5],
          amenitiesArray[5],
          2
        )}
      </>
    );
  };

  const renderPrice = () => {
    return `${priceRange.min}€ - ${priceRange.max}€ per night`;
  };

  const renderReservationDateAndPrice = () => {
    if (!expand) return null;

    let formattedStartDate;
    let formattedEndDate;

    if (startDate) {
      formattedStartDate = formattedDate(startDate);
    }

    if (endDate) {
      formattedEndDate = formattedDate(endDate);
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className={classes.dateDiv}
            onClick={() => {
              setOpenCalendar(true);
            }}
          >
            <span style={{ fontWeight: "bold" }}>
              {startDate ? formattedStartDate : "Pick a start date"}
            </span>
          </div>
          <div
            className={classes.dateDiv}
            onClick={() => {
              setOpenCalendar(true);
            }}
          >
            <span style={{ fontWeight: "bold" }}>
              {endDate ? formattedEndDate : "Pick a end date"}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{renderPrice()}</span>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    if (!openCalendar) return;

    return (
      <div className={classes.calendarDiv}>
        <Calendar
          value={date}
          tileDisabled={tileDisabled}
          minDate={minDate}
          maxDate={maxDate}
          className={classes.calendar}
          onChange={handleDateChange}
        />
      </div>
    );
  };

  return (
    <div
      className={classes.cardDiv}
      style={{
        height: expand ? "32rem" : "16rem",
        aspectRatio: "auto",
      }}
    >
      <div style={{ height: "10rem", width: "100%" }}>
        <img
          src={data.image}
          className={classes.imageStyles}
          alt={data.title}
        />
      </div>
      <div className={classes.informationDiv}>
        <div className={classes.titleDiv}>
          <span style={{ fontWeight: "bold", fontSize: "0.75rem" }}>
            {data.title}
          </span>
        </div>
        {renderBasicInfo()}
        {renderAmenities()}
        {renderReservationDateAndPrice()}
      </div>
      {renderCalendar()}
      {renderExpand()}
    </div>
  );
};

export default SingleAccomodation;
