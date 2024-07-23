import { formatChemicalFormula } from "mc-react-library";

export function calcElementArray(formula) {
  var formula_no_numbers = formula.replace(/[0-9]/g, "");
  var elements = formula_no_numbers.split(/(?=[A-Z])/);
  return elements;
}

export function countNumberOfAtoms(formula) {
  // split on capital letters to get element+number strings
  var elnum = formula.split(/(?=[A-Z])/);
  var num = 0;
  elnum.forEach((v) => {
    let match = v.match(/\d+/);
    let n = match == null ? 1 : parseInt(match[0]);
    num += n;
  });
  return num;
}

export function formatTitle(formulaStr, id, method) {
  return (
    <span>
      {formatChemicalFormula(formulaStr)} ({id}/{method})
    </span>
  );
}
