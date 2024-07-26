export function wavelengthName(wl) {
  let result = wl.slice(0, -1);
  if (wl.charAt(wl.length - 1) === "a") {
    result = result.concat("\u03B1");
  } else if (wl.charAt(wl.length - 1) === "b") {
    result = result.concat("\u03B2");
  } else {
    console.log("wavelength name conversion failed!");
    result = wl;
  }
  return result;
}

export function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i);
  }
  return arr;
}

export function gaussian(a, b, c, x) {
  return a * Math.exp(-Math.pow((x - b) / c, 2) / 2);
}

export function lorentz(x0, gamma, k, x) {
  return (k * Math.pow(gamma, 2)) / (Math.pow(gamma, 2) + Math.pow(x - x0, 2));
}

export function gaussianBroadening(two_thetas, intensities, FWHM, x) {
  let bArr = two_thetas.slice();
  let c = FWHM / 2 / Math.pow(2 * Math.log(2), 0.5);
  let curve = new Array(x.length).fill(0);
  for (let i = 0; i < intensities.length; i++) {
    let a =
      (2 * intensities[i] * Math.sqrt(Math.log(2))) / FWHM / Math.sqrt(Math.PI);
    for (let ix = 0; ix < x.length; ix++) {
      curve[ix] += gaussian(a, bArr[i], c, x[ix]);
    }
  }
  return curve;
}

export function lorentzianBroadening(two_thetas, intensities, FWHM, x) {
  let x0Arr = two_thetas.slice();
  let gamma = FWHM / 2;

  let curve = new Array(x.length).fill(0);
  for (let i = 0; i < intensities.length; i++) {
    let k = (intensities[i] * 2) / FWHM / Math.PI;

    for (let ix = 0; ix < x.length; ix++) {
      curve[ix] += lorentz(x0Arr[i], gamma, k, x[ix]);
    }
  }
  return curve;
}

function checkArraysEqual(arr1, arr2, eps = 0.0001) {
  for (let i = 0; i < arr1.length; i++) {
    if (Math.abs(arr1[i] - arr2[i]) > eps) {
      return false;
    }
  }
  return true;
}

export function doFitting(xrd, fwhm, fit_type) {
  let two_thetas = xrd.peaks_positions;

  // have more points for very sharp peaks
  let pointDensityGuess = Math.min(fwhm / 5, 0.1);
  let numPoints = Math.round(
    (xrd.angular_range[1] - xrd.angular_range[0]) / pointDensityGuess,
  );
  // console.log(numPoints);
  let xArr = makeArr(xrd.angular_range[0], xrd.angular_range[1], numPoints);

  let fitCurve = null;

  if (fit_type === "Gaussian") {
    fitCurve = gaussianBroadening(two_thetas, xrd.intensities, fwhm, xArr);
  } else if (fit_type === "Lorentzian") {
    fitCurve = lorentzianBroadening(two_thetas, xrd.intensities, fwhm, xArr);
  } else {
    console.log("Fit type not defined!");
    return null;
  }

  return {
    x: xArr,
    curve: fitCurve,
  };
}

export const getFittedCurve = (xrd, fwhm, fitType) => {
  let fit = doFitting(xrd, fwhm, fitType);

  let curve_dict = {
    x: fit.x,
    y: fit.curve,
    type: "scatter",
    mode: "lines+points",
    marker: { color: "red", size: 0.5 },
    line: { width: 2 },
    hoverinfo: "none",
  };
  // console.log(Math.max(...fit.curve));
  return curve_dict;
};

export const getHistogram = (xrd) => {
  let hist_dict = {
    x: xrd.peaks_positions,
    y: xrd.intensities,
    text: xrd.hkls,
    type: "bar",
    hovertemplate: "hkl: <b>%{text}</b><extra></extra>",
    width: 0.7,
    marker: {
      color: "black",
      opacity: 0.6,
    },
  };
  return hist_dict;
};
