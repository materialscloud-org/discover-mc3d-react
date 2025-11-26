import { formatChemicalFormula } from "mc-react-library";
import { ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "./aiidaRestApiUtils";

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

export function countNumberOfElements(formula) {
  return formula.split(/(?=[A-Z])/).length;
}

export function formatTitle(formulaStr, id, method) {
  return (
    <span>
      {formatChemicalFormula(formulaStr)} ({id}/{method})
    </span>
  );
}

export function format_aiida_prop(
  property,
  metadata,
  methodLabel,
  prec = 3,
  factor = 1,
) {
  if (property == null) {
    return <span>N/A</span>;
  }
  let val = property.value ?? 0.0;
  val *= factor;
  let valStr = val.toFixed(prec);
  if (metadata.unit) {
    valStr += ` ${metadata.unit}`;
  }
  return (
    <span>
      {valStr}{" "}
      <ExploreButton
        explore_url={EXPLORE_URLS[methodLabel]}
        uuid={property.uuid ?? null}
      />
    </span>
  );
}
