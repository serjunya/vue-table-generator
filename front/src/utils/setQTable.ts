import { ref, Ref } from 'vue';
import { adjectives, nouns, verbs, names, chars } from 'app/public/arrays';
import { QTableColumn as Column } from 'quasar';

interface Input {
  label: string;
  model: string;
  rules: ((val: any) => any)[];
  type?: 'number' | 'textarea' | 'time' | 'text' | 'password'
  | 'email' | 'search' | 'tel' | 'file' | 'url' | 'date';
  stackLabel?: boolean;
  mask?: string;
}
interface EntityField {
  name: string;
  title: string;
  dataType: string;
  defaultValue?: any;
}
export type Entity = { [k: string]: any };

const entityTemplate: Map<string, any> = new Map;
export const setColumns = (entity: { properties: [] }) => {
  const columns: Column[] = [];
  entity.properties.forEach((item: EntityField) => {
    const column: Column = {
      name: item.name,
      label: item.title,
      field: item.name,
      sortable: true
    }
    switch (item.dataType) {
      case 'Date':
        entityTemplate.set(item.name, Date);
        column.format = (val: string) => new Date(val).toLocaleString();
        break;
      case 'number':
        entityTemplate.set(item.name, Number);
        column.format = (val: string) => `${Number(val || item.defaultValue)}`;
        break;
      default:
        entityTemplate.set(item.name, String);
        column.align = 'left';
        column.classes = 'overflown-text';
        column.style = 'max-width: 14vw; overflow: hidden; text-overflow: ellipsis';
    }
    columns.push(column);
  })
  return columns;
}

export const defineModels = () => {
  const modelsMap: Map<string, any> = new Map;
  for (const model of Array.from(entityTemplate.keys())) {
    modelsMap.set(model, ref(null /*entT[model]*/));
  }
  return Object.fromEntries(modelsMap.entries());
}

export const setFormInputs = (entity: { properties: [] }) => {
  const inputs: Input[] = [];
  entity.properties.forEach((item: EntityField) => {
    if (item.name !== '_id') {
      const input: Input = {
        label: item.title,
        model: item.name,
        rules: [],
        type: 'text',
      }
      switch (item.dataType) {
        case 'Date':
          input.mask = 'datetime';
          input.rules = [(val: string) => !!val || 'Введите данные'];
          break;
        case 'number':
          input.type = 'number';
          input.rules = [(val: number) => !!val && Number.isInteger(+val)
            || 'Введите целое число'];
          break;
        case 'password':
          input.type = 'password';
        default:
          input.rules = [(val: string) => !!val || 'Введите данные'];
      }
      inputs.push(input);
    }
  })
  return inputs;
}

export const randomNumber = () => Math.floor(Math.random() * 100);
const randomName = () => randomElement(names);
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
};
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

export const randomize = (models: any, inputs: Input[]) => {
  for (const input of inputs) {
    if (input.mask)
      models[input.model].value = randomDate();
    else {
      switch (input.type) {
        case 'text':
          models[input.model].value = generateText();
          break;
        case 'number':
          models[input.model].value = randomNumber();
          break;
        case 'password':
          models[input.model].value = generatePassword();
          break;
      }
    }
  }
}

export const highlightRow = (rowIndex: number) => {
  const row = document.querySelector(
    `.data tr.cursor-pointer:nth-child(${rowIndex + 1})`
    ) as HTMLElement;
  row.style.backgroundColor = 'lightgrey';
}
export const unhighlightRow = (rowIndex: number) => {
  const row = document.querySelector(
    `.data tr.cursor-pointer:nth-child(${rowIndex + 1})`
    ) as HTMLElement;
  row.style.removeProperty('background-color');
}
