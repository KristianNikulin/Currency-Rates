import axios from 'axios';
import * as iconv from 'iconv-lite';
import { parseStringPromise } from 'xml2js';

interface CurrencyData {
  code: string;
  name: string;
  rate: number;
}

export async function getCurrencyRates(code: string, date: string): Promise<CurrencyData> {
  if (typeof code !== 'string' || typeof date !== 'string') {
    throw new Error('Missing arguments. Please provide both currency code and date.');
  }
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!date.match(datePattern)) {
    throw new Error('Invalid date format. Please use the format "YYYY-MM-DD".');
  }

  const formattedDate = date.split('-').reverse().join('/');
  const url = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${formattedDate}`;
  
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const xmlData = iconv.decode(response.data, 'windows-1251');

  const parsedData = await parseStringPromise(xmlData);
  const valutes = parsedData.ValCurs.Valute;

  for (const valute of valutes) {
    if (valute.CharCode[0] === code) {
      const rate = parseFloat(valute.Value[0].replace(',', '.'));
      return {
        code,
        name: valute.Name[0],
        rate,
      };
    }
  }
  throw new Error(`Currency with code '${code}' not found for the date '${date}'.`);
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const codeIndex = args[0].indexOf('--code');
    const dateIndex = args[1].indexOf('--date');
    let code, date;

    if (codeIndex !== -1 && dateIndex !== -1) {
      code = args[0].slice(7); 
      date = args[1].slice(7); 
    } else {
      throw new Error('Usage: node currency_rates --code=USD --date=2022-10-08');
    }

    const currencyData = await getCurrencyRates(code, date);

    console.log(`${currencyData.code} (${currencyData.name}): ${currencyData.rate.toFixed(4)}`);
  } catch (error) {
    console.error(error || 'An error occurred while fetching currency rates.');
  }
}

main();
