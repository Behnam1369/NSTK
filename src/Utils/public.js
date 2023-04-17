export function fileSize(file) {
  if (file.size < 1024) {
    return file.size + " B";
  } else if (file.size < 1024 * 1024) {
    return (file.size / 1024).toFixed(2) + " KB";
  } else if (file.size < 1024 * 1024 * 1024) {
    return (file.size / (1024 * 1024)).toFixed(2) + " MB";
  } else if (file.size < 1024 * 1024 * 1024 * 1024) {
    return (file.size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  } else {
    return (file.size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " TB";
  }
}

export const thousandSep = (num) => {
  if (num == 0) {
    return 0;
  } else if (!num) {
    return "";
  } else if (num > 0) {
    let parts = num
      .toString()
      .replace(/[^0-9.]/g, "")
      .split(".");
    parts[0] = parseInt(parts[0])
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.filter((part, i) => i < 2).join(".");
  } else {
    let parts = num
      .toString()
      .replace(/[^0-9.]/g, "")
      .split(".");
    parts[0] = parseInt(parts[0])
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "-" + parts.filter((part, i) => i < 2).join(".");
  }
};

export const toNumber = (num) => {
  return num.replace(/,/g, "");
};

function div(a, b) {
  return parseInt(a / b);
}

export const shamsiDate = (gdt) => {
  var res = "";
  if (gdt != "") {
    var g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    var jalali = [];

    var gy = parseInt(gdt.substring(0, 4)) - 1600;
    var gm = parseInt(gdt.substring(5, 7)) - 1;
    var gd = parseInt(gdt.substring(8, 10)) - 1;

    var g_day_no =
      365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400);

    for (var i = 0; i < gm; ++i) g_day_no += g_days_in_month[i];
    if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || gy % 400 == 0))
      /* leap and after Feb */
      g_day_no++;
    g_day_no += gd;

    var j_day_no = g_day_no - 79;

    var j_np = div(j_day_no, 12053);
    /* 12053 = 365*33 + 32/4 */
    j_day_no = j_day_no % 12053;

    var jy = 979 + 33 * j_np + 4 * div(j_day_no, 1461);
    /* 1461 = 365*4 + 4/4 */

    j_day_no %= 1461;

    if (j_day_no >= 366) {
      jy += div(j_day_no - 1, 365);
      j_day_no = (j_day_no - 1) % 365;
    }
    for (var i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i)
      j_day_no -= j_days_in_month[i];
    var jm = i + 1;
    var jd = j_day_no + 1;
    jalali[0] = jy;
    jalali[1] = jm;
    jalali[2] = jd;

    res = jy + "/" + jm + "/" + jd;
    var z = res.split("/");
    res = z[0] + "/" + ("0" + z[1]).slice(-2) + "/" + ("0" + z[2]).slice(-2);
  }

  return res;
  //return jalali[0] + "_" + jalali[1] + "_" + jalali[2];
  //return jy + "/" + jm + "/" + jd;
};

export const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};
