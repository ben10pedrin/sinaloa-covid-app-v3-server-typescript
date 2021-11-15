const stringSimilarity = require("string-similarity");
const Rainbow = require("rainbowvis.js");

export const casesToHexGradient = (cases: number) => {
  var rainbow = new Rainbow();
  rainbow.setNumberRange(0, 101);
  rainbow.setSpectrum("green", "yellow", "red");

  if (cases <= 0) cases = 0;
  if (cases >= 101) cases = 101;

  return `#${rainbow.colourAt(cases)}`;
};

export const formatUnderscoreDate = (date: Date): string => {
  // Return day_month_year
  const day = getDatePart({ day: "2-digit" }, date);
  const month = getDatePart({ month: "2-digit" }, date);
  const year = getDatePart({ year: "numeric" }, date);
  return `${day}_${month}_${year}`;
};

export const stripAccents = (s: string) => {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
export const similarity = (s1: string, s2: string) => {
  return stringSimilarity.compareTwoStrings(
    stripAccents(s1).toLowerCase(),
    stripAccents(s2).toLowerCase()
  );
};

export const capitalizeFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const sortObjectByValueDescending = (dict: any) => {
  // Create items array
  let items = Object.keys(dict).map(function (key) {
    return [key, dict[key]];
  });

  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });

  const sorted_obj: any = {};
  items.forEach((item) => {
    const use_key = item[0];
    const use_value = item[1];
    sorted_obj[use_key] = use_value;
  });

  return sorted_obj;
};

// Helper function for getting a fragment of the current date
const getDatePart = (obj: { [index: string]: string }, date: Date) => {
  return capitalizeFirstLetter(date.toLocaleDateString("es-ES", obj));
};

export const formatHumanDate = (filename: string) => {
  // Return weekday dayOfMonth de year
  // Split filename
  let [d, m, y]: Array<string> = filename.split("_");
  // Get date
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  // Actual program
  const weekday = getDatePart({ weekday: "long" }, date);
  const dayOfMonth = getDatePart({ day: "numeric" }, date);
  const year = getDatePart({ month: "long" }, date);
  // Format It
  return `${weekday} ${dayOfMonth} De ${year}`;
};

export const jsonFilenameToDate = (filename: string) => {
  filename = filename.replace('.json','')
  let [d, m, y]: Array<string> = filename.split("_");
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
}

export const URL_PREFIX =
  "https://saludsinaloa.gob.mx/wp-content/uploads/2020/reportescovid/INFORME%20DIARIO%20PUBLICO%20COVID19%20";
export const RIGHT_NAMES = [
  "Ahome",
  "Angostura",
  "Badiraguato",
  "Choix",
  "Concordia",
  "Cosalá",
  "Culiacán",
  "El Fuerte",
  "Elota",
  "Escuinapa",
  "Guasave",
  "Mazatlán",
  "Mocorito",
  "Navolato",
  "Rosario",
  "Salvador Alvarado",
  "San Ignacio",
  "Sinaloa",
];
