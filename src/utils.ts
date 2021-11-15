var stringSimilarity = require("string-similarity");

export const formatUnderscoreDate = (date: Date) => {
  // Return day_month_year
  const day = getDatePart({ day: "2-digit" }, date);
  const month = getDatePart({ month: "2-digit" },date);
  const year = getDatePart({ year: "numeric" }, date);
  return `${day}_${month}_${year}`;
};

export const stripAccents = (s: string) => {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
} 
export const similarity = (s1: string, s2: string) => {
    return stringSimilarity.compareTwoStrings(stripAccents(s1).toLowerCase(), stripAccents(s2).toLowerCase());
}

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
const getDatePart = (obj:{ [index: string]: string }, date: Date) => {
    return capitalizeFirstLetter(date.toLocaleDateString("es-ES", obj));
}

export const formatHumanDate = (filename: string) => {
  // Return weekday dayOfMonth de year
  // Split filename
  let [d, m, y]: Array<string> = filename.split("_");
  // Get date
  const date = new Date(`${y}-${m}-${parseInt(d) + 1}`);
  // Actual program
  const weekday = getDatePart({ weekday: "long" }, date);
  const dayOfMonth = getDatePart({ day: "numeric" },date);
  const year = getDatePart({ month: "long" }, date);
  // Format It
  return `${weekday} ${dayOfMonth} De ${year}`;
};

export const URL_PREFIX =
  "https://saludsinaloa.gob.mx/wp-content/uploads/2020/reportescovid/INFORME%20DIARIO%20PUBLICO%20COVID19%20";
export const RIGHT_NAMES = [
  "Culiacán",
  "Ahome",
  "Guasave",
  "Mazatlán",
  "El Fuerte",
  "Salvador Alvarado",
  "Elota",
  "Sinaloa",
  "Angostura",
  "Navolato",
  "Badiraguato",
  "Rosario",
  "Mocorito",
  "Cosalá",
  "San Ignacio",
  "Escuinapa",
  "Choix",
  "Concordia",
];
