import NumberColumnType from '@revolist/revogrid-column-numeral';
import { type RevoGrid } from '@revolist/revogrid/dist/types/interfaces';

interface EntityField {
    name: string;
    title: string;
    dataType: string;
    defaultValue?: any;
}

export interface EntityModel {
    '_id': number;
    '_createUser': string;
    '_updateUser': string;
    '_createDt': string;
    '_updateDt': string;
    'Login': string;
    'Name': string;
    'Password': string;
    'Lang': string;
    'LoginsCount': number;
}

export const plugin = { 'number': new NumberColumnType('0') }; // create plugin entity
export const setColumns = (entity: { properties: [] }) => {
    const cols: RevoGrid.ColumnRegular[] = [];
    entity.properties.forEach((item: EntityField) => {
        cols.push({
          prop: item.name,
          name: item.title,
          size: 150,
          columnType: item.dataType,
          rowDrag: true,
          sortable: true,
          filter: item.dataType === 'string' ? 'customStringFilter' : undefined
        })
    })
    return cols;
}

import { adjectives, nouns, verbs, chars } from '../../public/arrays';

export const randomNumber = () => Math.floor(Math.random() * 100);
export const getDateString = (date: Date): string => {
  let DD = `${date.getDate()}`,
    MM = `${date.getMonth() + 1}`,
    HH = `${date.getHours()}`,
    mm = `${date.getMinutes()}`;
  if (DD.length === 1)
    DD = `0${DD}`;
  if (MM.length === 1)
    MM = `0${MM}`;
  if (HH.length === 1)
    HH = `0${HH}`;
  if (mm.length === 1)
    mm = `0${mm}`;
  return `${date.getFullYear()}/${MM}/${DD} ${HH}:${mm}`;
}
export const randomDate = () => {
  const randomDate = new Date(Math.floor(Math.random() * 2 * 10e+11));
  return getDateString(randomDate);
}
const randomElement = (arr: any) => arr[Math.floor(Math.random() * arr.length)];
const isVowel = (char: string) => {
  return char === 'a' || char === 'e' || char === 'i' || char === 'o';
}

const generateConcat = () => {
  const adjective = randomElement(adjectives);
  const randomNoun = randomElement(nouns);
  const noun = randomNoun[0].toUpperCase() + randomNoun.slice(1);
  return adjective + noun;
}

export const generatePassword = () => {
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += randomElement(chars);
  }
  return password;
}

export const generateText = () => {
  let text = '';
  const sentenceCount = 1 + Math.floor(Math.random() * 4);
  for (let i = 0; i < sentenceCount; i++) {
    const subject = randomElement(nouns),
      verb = randomElement(verbs),
      object = randomElement(nouns);
    const subjAdjCount = Math.floor(Math.random() * 5);
    const objAdjCount = Math.floor(Math.random() * 5);
    let sentence = '';
    for (let k = 0; k < subjAdjCount; k++) {
      sentence += randomElement(adjectives) + ' ';
    }
    sentence += subject + ' ' + verb;
    let objPart = '';
    for (let k = 0; k < objAdjCount; k++) {
      objPart += randomElement(adjectives) + ' ';
    }
    objPart += object + '.';
    if (isVowel(objPart[0])) {
      sentence += ' an ';
    }
    else {
      sentence += ' a ';
    }
    sentence += objPart;
    text += sentence[0].toUpperCase() + sentence.slice(1) + ' ';
  }
  return text;
}
