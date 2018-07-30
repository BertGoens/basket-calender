// result should match our headers

interface googleCsv {
  Subject: string;
  StartDate: string;
  StartTime: string;
  EndDate: string;
  EndTime: string;
  IsAllDayEvent: boolean;
  IsPrivate: boolean;
  Location: string;
  Description: string;
}

/**
 *  EXAMPLE FILLED IN

  Subject         H2 Match op Koninklijke BBC Oostkamp J21 A
  Start date      08-08-2018
  Start time      18:50
  End Date        08-08-2018
  End Time        22:00
  All Day Event   False
  Private"        False
  Location        ;
  Description     Vertrek 18:50\r\nStart match 20:00\r\nZaal De Valkaart\r\n\r\nTegenstander: Koninklijke BBC Oostkamp
*/

const inputCsvExample = [
  "0 Thuisploeg",
  "1 Uit",
  "2 Datum",
  "3 vertrekuur",
  "4 aanvangsuur",
  "5 zaal",
  "6 Home"
];
