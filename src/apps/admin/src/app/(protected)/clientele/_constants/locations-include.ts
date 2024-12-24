/**
 * Include query to fetch client locations
 */
const LocationsInclude = {
  country: {
    include: {
      alternatenames: {
        where: {
          isoLanguage: "en",
        },
      },
    },
  },
  stateProvince: {
    include: {
      alternatenames: {
        where: {
          OR: [{ isoLanguage: "en" }, { isoLanguage: "abbr" }],
        },
      },
    },
  },
  city: {
    include: {
      alternatenames: {
        where: {
          isoLanguage: "en",
        },
      },
    },
  },
};

export default LocationsInclude;
