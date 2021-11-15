import { formatHumanDate, capitalizeFirstLetter, RIGHT_NAMES, sortObjectByValueDescending, similarity } from "../utils";

export class PdfExtractor {
  text: string;
  filename: string;
  output: {
    dateStr: string | null;
    globalNewDeaths: number | null;
    globalNewCases: number | null;
    trafficLight: string | null;
    newCases: Array<object> | null;
    newDeaths: Array<object> | null;
    activeCases: Array<object> | null;
  };

  constructor(text: string, filename: string) {
    this.text = text;
    this.filename = filename;
    this.output = {
      dateStr: null,
      globalNewDeaths: null,
      globalNewCases: null,
      trafficLight: null,
      newCases: null,
      newDeaths: null,
      activeCases: null,
    };
  }

  dateStr(): void {
    this.output["dateStr"] = formatHumanDate(this.filename);
  }

  globalNewDeaths() {
    const x = this.text.match(/(\d+)\s?nuevos\s?fallecimientos/);
    if (x != null && x[1] != null) {
      this.output["globalNewDeaths"] = parseInt(x[1]);
    } else {
      throw new Error("Can't find Global New Deaths");
    }
  }

  globalNewCases() {
    const x = this.text.match(/(\d+)\s?NUEVOS🚨/);
    if (x != null && x[1] != null) {
      this.output["globalNewCases"] = parseInt(x[1]);
    } else {
      throw new Error("Can't find Global New Cases");
    }
  }

  trafficLight() {
    const x = this.text.match(/TODO EL ESTADO:?\s?([^\s]+)/);
    if (x != null && x[1] != null) {
      this.output["trafficLight"] = capitalizeFirstLetter(x[1].toLowerCase());
    }
  }

  newCases() {
    const x = this.text.match(/NUEVOS🚨([\S\s]*?)Pacientes/);
    if (x != null && x[1] != null) {
      this.output["newCases"] = stringToSanatizedJson(x[1]);
    } else {
      throw new Error("Can't find New Cases");
    }
  }

  newDeaths() {
    let x: any = this.text.match(/fallecimientos([\S\s]*?)Pacientes/);
    if (x != null && x[1] != null) {
      x = x[1];
      // First word: Sequence of digits, optionally with a space, then a sequence of characters (without comma nor parantheses)
      // Can be Culiacan13 or Culiacan 13
      // Then a space or a line break
      // Second Word: Sequence of characters (without digits, comma nor parantheses)
      // Can be El or Salvador but not 7 or , or (hello
      let m: any = x.match(/[^\s\d,()]+[\n\s]?[^\s,()]+\s?\d+/g);
      // Remove wrong matches
      const EXCLUSION_LIST = [
        "últimas",
        "ultimas",
        "EN",
        "DISPONIBLES",
        "EL",
        "HOSPITALIZADOS",
        "ACTIVOS",
        "rezagadas",
      ];
      let i = 0;
      while (i < m.length) {
        for (const word of EXCLUSION_LIST) {
          if (m[i].includes(word)) {
            m.splice(i,1);
            i -= 1;
            break;
          }
        }
        i += 1;
      }
      
      if (m.length > 0) {
        m = m.join(" ");
        this.output["newDeaths"] = stringToSanatizedJson(m);
      }
    } else {
      throw new Error("Can't find New Deaths");
    }
  }

  activeCases() {
    let x: any = this.text.match(/Municipio([\S\s]*?)SOSPECHOSOS/);
    if (x != null && x[1] != null) {
      x = x[1];
      let m = x.match(/[^\s\d,()]+[\n\s]?[^\s,()]+\s?\d+/g);
      if (m !== null) {
        m = m.join(" ");
        this.output["activeCases"] = stringToSanatizedJson(m);
      } else {
        throw new Error("Active Cases No Pair Matches");
      }
    } else {
      throw new Error("Can't find Active Cases");
    }
  }

  getOutputJson() {
    this.dateStr();
    this.globalNewDeaths();
    this.globalNewCases();
    this.trafficLight();
    this.newCases();
    this.newDeaths();
    this.activeCases();
    return this.output;
  }
}

const stringToSanatizedJson = (s: string) => {
    // Remove substring 'De' and ':' and '*' (From De: and CULIACÁN: and *Pacientes)
    s=s.replace(/De/g, '')
    s=s.replace(/:/g, '')
    s=s.replace(/\*/g, '')

    // Remove leading and trailing whitespace
    s=s.trim()

    // If empty raise error
    if (s=="") {
        throw new Error("Trimmed string is empty")
    }

    // Split by digit ['El Fuerte', '15',...]
    const arr: RegExpMatchArray | null = s.match(/\d+|\D+/g)

    // Raise error if array length not pair or is empty
    if (arr==null ||arr.length%2==1 || arr.length==0) {
        throw new Error("Array length not pair or is empty")
    }

    let found:boolean|null = null
    const d: {[index: string]: number} = {}
    for (let i=0; i<arr.length; i+=2) {
        // Iterate through names with accent
        found = false
        for (const name of RIGHT_NAMES) {
            // Using similarity algorithm
            if (similarity(name, arr[i].trim()) > 0.7) {
                // Remove whitespace
                // Cast to integer
                d[name] = parseInt(arr[i+1])
                found=true
                break
            } 
        }
        // If name is not right, then raise error
        if (!found) {
            throw new Error("City name is not right")
        }
    }

    // Return sorted dictionary
    return sortObjectByValueDescending(d)
}