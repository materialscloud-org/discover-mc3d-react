export function gaussian(a, b, c, x) {
  //var x = makeArr(x_range[0], x_range[1], N);
  var y = [];
  for (let i = 0; i < x.length; i++) {
    y.push(a * Math.exp(-Math.pow((x[i] - b) / c, 2) / 2));
  }
  return y;
}

export function lorentz(x0, gamma, k, x) {
  //var x = makeArr(x_range[0], x_range[1], N);
  var y = [];
  for (let i = 0; i < x.length; i++) {
    y.push(
      (k * Math.pow(gamma, 2)) / (Math.pow(gamma, 2) + Math.pow(x[i] - x0, 2)),
    );
  }
  return y;
}

export function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i);
  }
  return arr;
}

export function do_gauss_fit(two_thetas, intensities, FWHM, x) {
  var a_arr = [];
  var b_arr = two_thetas.slice();
  var c = FWHM / 2 / Math.pow(2 * Math.log(2), 0.5);
  var gaussians = [];
  var peaks = [];
  var curve = [];
  var summ = 0;
  for (let i = 0; i < intensities.length; i++) {
    a_arr.push(
      (2 * intensities[i] * Math.pow(Math.log(2), 0.5)) /
        FWHM /
        Math.pow(Math.PI, 0.5),
    );
    var gauss = gaussian(a_arr[i], b_arr[i], c, x);
    gaussians.push(gauss);
    peaks.push(Math.max.apply(Math, gauss));
  }
  for (let i = 0; i < x.length; i++) {
    summ = 0;
    for (let j = 0; j < intensities.length; j++) {
      summ = summ + gaussians[j][i];
    }
    curve.push(summ);
  }
  return {
    curve: curve,
    peaks: peaks,
  };
}

export function do_lorentz_fit(two_thetas, intensities, FWHM, x) {
  var x0_arr = two_thetas.slice();
  var gamma = FWHM / 2;
  var k_arr = [];
  var lorentzians = [];
  var peaks = [];
  var summ = 0;
  var curve = [];

  for (let i = 0; i < intensities.length; i++) {
    k_arr.push((intensities[i] * 2) / FWHM / Math.PI);
    var lorentzian = lorentz(x0_arr[i], gamma, k_arr[i], x);
    lorentzians.push(lorentzian);
    peaks.push(Math.max.apply(Math, lorentzian));
  }
  for (let i = 0; i < x.length; i++) {
    summ = 0;
    for (let j = 0; j < intensities.length; j++) {
      summ = summ + lorentzians[j][i];
    }
    curve.push(summ);
  }
  return {
    curve: curve,
    peaks: peaks,
  };
}

export function conv_wl_name(name) {
  let result = name.slice(0, -1);
  if (name.charAt(name.length - 1) === "a") {
    result = result.concat("\u03B1");
  } else if (name.charAt(name.length - 1) === "b") {
    result = result.concat("\u03B2");
  } else {
    console.log("wavelength name conversion failed!");
    result = name;
  }
  return result;
}

export function doFitting(
  peaks_positions,
  intensities,
  angular_range,
  fwhm,
  fit_type,
) {
  let two_thetas = peaks_positions;

  let N = 1000;
  let x = makeArr(angular_range[0], angular_range[1], N);

  let fit = null;

  if (fit_type === "Gaussian") {
    fit = do_gauss_fit(two_thetas, intensities, fwhm, x);
  } else if (fit_type === "Lorentzian") {
    fit = do_lorentz_fit(two_thetas, intensities, fwhm, x);
  } else {
    console.log("Fit type not defined!");
    return null;
  }

  let curve = fit.curve;
  let peaks = fit.peaks;
  return {
    x: x,
    curve: curve,
    peaks: peaks,
  };
}
