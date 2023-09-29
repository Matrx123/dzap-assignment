/* eslint-disable no-useless-escape */
import { amtErr, ethErr, eth_amt_err } from "../constants/errorCodes";
import { allowedFormats } from "../constants/projConsts";

const getErrors = (items, setDup) => {
  let errors = [];
  const itemToIndices = new Map();
  for (let i = 0; i < items.length; i++) {
    const element = items[i];
    const address_amount = element.split(new RegExp(`[${allowedFormats}]`));
    //consume address and amount
    const address = address_amount[0].trim();
    const amount = address_amount[1].trim();
    //Error Cases
    const _ethErr = /^0x[a-fA-F0-9]{40}$/.test(address); //regex to check address
    const _amtErr = /^\d+(\.\d+)?$/.test(amount); //regex to check amount
    //Error cases for tokens and amount
    if (!_ethErr && !_amtErr) {
      errors.push(`Line ${i + 1} ${eth_amt_err}`);
    } else if (!_ethErr) {
      errors.push(`Line ${i + 1} ${ethErr}`);
    } else if (!_amtErr) {
      errors.push(`Line ${i + 1} ${amtErr}`);
    }
    //Duplicate check
    if (itemToIndices.has(address)) {
      const indices = itemToIndices.get(address);
      indices.push(i + 1);
      itemToIndices.set(address, indices);
    } else {
      itemToIndices.set(address, [i + 1]);
    }
  }
  //add the duplicates error in error array
  itemToIndices.forEach((indices, address) => {
    if (indices.length > 1) {
      errors.push({ address, indices: indices.join(",") });
    }
  });
  //set the flag for keep 1st and sum the amount button
  setDup(errors.some((item) => typeof item === "object"));
  return errors;
};

export const processInputTexts = (val, setErrors, setDup) => {
  const textArray = val.length && val.split("\n");
  if (textArray.length) {
    const errors = getErrors(textArray, setDup);
    setErrors(errors);
  } else {
    setErrors([`Can't detect line breaks`]);
  }
};

const totalSum = (stringsArray, indexesArray) => {
  let totalSum = 0;

  for (const index of indexesArray) {
    if (index - 1 >= 0 && index - 1 < stringsArray.length) {
      const substring = stringsArray[index - 1];
      const address_amount = substring.split(new RegExp(`[${allowedFormats}]`));
      const amount = address_amount[1].trim();

      const number = parseInt(amount, 10); // Convert the substring to a number
      if (!isNaN(number)) {
        totalSum += number;
      }
    }
  }

  return totalSum;
};

//updating the amount
const replaceAmountFromReverse = (inputString, searchString, replacement) => {
  const searchArray = searchString.split("|");
  const delimiter = searchArray.filter((str) => inputString.includes(str));
  const _data = inputString.split(delimiter);
  _data[1] = replacement;
  return _data.join(delimiter);
};

const getUpdatedSumString = (totalSumArray, newTextArray) => {
  let updatedArray = [];
  for (let i = 0; i < newTextArray.length; i++) {
    const address_amount = newTextArray[i].split(
      new RegExp(`[${allowedFormats}]`)
    );
    const address = address_amount[0].trim();
    const sumIndex = totalSumArray.findIndex((obj) => obj.address === address);
    if (sumIndex !== -1) {
      const result = replaceAmountFromReverse(
        newTextArray[i],
        allowedFormats,
        totalSumArray[sumIndex].total.toString()
      );
      updatedArray.push(result);
    } else {
      updatedArray.push(newTextArray[i]);
    }
  }
  return updatedArray.join("\n");
};

export const keepFirstAction = (val, setVal, errors, setLines, type) => {
  const textArray = val.length && val.split("\n");
  let targetIndices = [];
  let sumArray = [];
  for (let i = 0; i < errors.length; i++) {
    const element = errors[i];
    if (typeof element === "object") {
      const { address, indices } = element;

      if (type === "combine") {
        const flatSubArray = indices.split(",").map((str) => Number(str));
        const total = totalSum(textArray, flatSubArray);
        sumArray.push({ address, total });
      }
      targetIndices.push(indices.replace(/^.\,/, ""));
    }
  }
  const flatArray = targetIndices.flatMap((item) =>
    item.split(",").map(Number)
  );
  //Remove this flat array from targetArray
  const newArray = textArray.filter(
    (item, index) => !flatArray.includes(index + 1)
  );
  const updatedText = newArray.join("\n");

  if (type === "combine") {
    const updatedSumText = getUpdatedSumString(sumArray, newArray);
    setVal(updatedSumText);
  } else {
    setVal(updatedText);
  }
  setLines(newArray.length);
};
