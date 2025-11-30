export class Formatter {
  static currency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    }).format(value);
  }

  static litres(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "unit",
      unit: "liter",
      maximumFractionDigits: 2,
    }).format(value);
  }

  static km(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "unit",
      unit: "kilometer",
      maximumFractionDigits: 2,
    }).format(value);
  }
}
