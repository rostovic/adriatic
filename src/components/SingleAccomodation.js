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
import {
  amenitiesArray,
  calculateTotalPrice,
  formattedDate,
} from "../functions/helpers";

const SingleAccomodation = ({ data, setModalInfo }) => {
  const [expand, setExpand] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [priceRange, setPriceRange] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dailyPrices, setDailyPrices] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const maxDate = new Date("2024-12-31");
  const minDate = new Date("2024-01-01");

  const handleReserve = () => {
    setModalInfo({
      title: data.title,
      totalPrice: totalPrice,
      startDate: startDate,
      endDate: endDate,
      capacity: data.capacity,
    });
    setExpand(false);
    setPriceRange(null);
    setStartDate(null);
    setEndDate(null);
    setDailyPrices(null);
    setTotalPrice(null);
  };

  useEffect(() => {
    if (startDate === null || endDate === null) {
      setDailyPrices(null);
      setTotalPrice(null);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const prices = data.pricelistInEuros.map((entry) => entry.pricePerNight);
    setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
  }, [data]);

  useEffect(() => {
    const calculateData = calculateTotalPrice(data, startDate, endDate);
    if (calculateData.totalPrice !== null) {
      setTotalPrice(calculateData.totalPrice);
    }
    if (calculateData.dailyPrices !== null) {
      setDailyPrices(calculateData.dailyPrices);
    }
  }, [data, startDate, endDate]);

  const isDateDisabled = (date) => {
    date.setHours(0, 0, 0, 0);

    return !data.availableDates.some((availableDate) => {
      const startDate = new Date(availableDate.intervalStart);
      const endDate = new Date(availableDate.intervalEnd);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return date >= startDate && date < endDate;
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
        <div className={classes.capacityDiv}>
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
        <div className={classes.soloAmenityDiv}>
          {icon}
          {data.amenities[property] ? (
            <FaCircleCheck size={20} color="green" />
          ) : (
            <FaCircleXmark size={20} color="red" />
          )}
        </div>
        <div className={classes.soloAmenityDiv}>
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

  const renderDailyPrices = () => {
    if (dailyPrices === null) return;
    return (
      <div className={classes.dailyPricesDiv}>
        {dailyPrices.map((dayPrice) => (
          <div
            style={{ width: "50%", justifyContent: "flex-end" }}
            key={dayPrice.day}
          >
            <span className={classes.fontBold}>
              {formattedDate(dayPrice.day)} - {dayPrice.price}€
            </span>
          </div>
        ))}
      </div>
    );
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
            <span className={classes.fontBold}>
              {startDate ? formattedStartDate : "Pick a start date"}
            </span>
          </div>
          <div
            className={classes.dateDiv}
            onClick={() => {
              setOpenCalendar(true);
            }}
          >
            <span className={classes.fontBold}>
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
          <span className={classes.fontBold}>{renderPrice()}</span>
        </div>

        {renderDailyPrices()}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span className={classes.fontBold}>Total price: {totalPrice}€</span>
        </div>
      </div>
    );
  };

  const renderReserveButton = () => {
    if (!startDate || !endDate) return;

    return (
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <button className={classes.buttonReserve} onClick={handleReserve}>
          RESERVE
        </button>
      </div>
    );
  };

  const renderCalendar = () => {
    if (!openCalendar) return;

    return (
      <div className={classes.calendarDiv}>
        <button
          className={classes.closeCalenderDiv}
          onClick={() => setOpenCalendar(false)}
        >
          X
        </button>
        <Calendar
          value={new Date()}
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
        height: dailyPrices ? "100%" : expand ? "32rem" : "16rem",
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
        {renderReserveButton()}
      </div>
      {renderCalendar()}
      {renderExpand()}
    </div>
  );
};

export default SingleAccomodation;
