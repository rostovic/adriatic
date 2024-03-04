export const formattedDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateTotalPrice = (data, startDate, endDate) => {
  if (!startDate || !endDate) return { totalPrice: null, dailyPrices: null };

  const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
  const endDateTime = new Date(endDate).setHours(0, 0, 0, 0);

  let totalPrice = 0;
  const dailyPrices = [];

  for (
    let currentDateTime = startDateTime;
    currentDateTime < endDateTime;
    currentDateTime += 24 * 60 * 60 * 1000
  ) {
    const isDateAvailable = data.availableDates.some((dateInterval) => {
      const intervalStart = new Date(dateInterval.intervalStart).setHours(
        0,
        0,
        0,
        0
      );
      const intervalEnd = new Date(dateInterval.intervalEnd).setHours(
        0,
        0,
        0,
        0
      );

      return (
        currentDateTime >= intervalStart &&
        currentDateTime < intervalEnd &&
        currentDateTime !== intervalEnd
      );
    });

    if (isDateAvailable) {
      const priceInterval = data.pricelistInEuros.find((priceInterval) => {
        const intervalStart = new Date(priceInterval.intervalStart).setHours(
          0,
          0,
          0,
          0
        );
        const intervalEnd = new Date(priceInterval.intervalEnd).setHours(
          0,
          0,
          0,
          0
        );

        return (
          currentDateTime >= intervalStart && currentDateTime < intervalEnd
        );
      });

      if (priceInterval) {
        const priceForDay = {
          day: new Date(currentDateTime),
          price: priceInterval.pricePerNight,
        };

        dailyPrices.push(priceForDay);
        totalPrice += priceInterval.pricePerNight;
      }
    }
  }
  return { totalPrice, dailyPrices };
};

export const amenitiesArray = [
  "airConditioning",
  "parkingSpace",
  "pets",
  "pool",
  "tv",
  "wifi",
];
