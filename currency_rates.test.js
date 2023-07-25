const { getCurrencyRates } = require("./currency_rates.js");

describe("getCurrencyRates", () => {
  it("should return currency data for an existing currency code and date", async () => {
    const code = "USD";
    const date = "2023-07-25";

    const currencyData = await getCurrencyRates(code, date);

    expect(currencyData.code).toBe("USD");
    expect(currencyData.name).toBe("Доллар США");
    expect(currencyData.rate).toBeGreaterThan(0);
  });

  it("should throw an error for a non-existing currency code", async () => {
    const code = "XYZ";
    const date = "2023-07-25";

    await expect(getCurrencyRates(code, date)).rejects.toThrow(
      `Currency with code '${code}' not found for the date '${date}'.`
    );
  });

  it("should throw an error for an invalid date format", async () => {
    const code = "USD";
    const date = "2022/10/08";

    await expect(getCurrencyRates(code, date)).rejects.toThrow(
      'Invalid date format. Please use the format "YYYY-MM-DD".'
    );
  });

  it("should throw an error for missing arguments", async () => {
    const code = "USD";
    const date = "2023-07-25";

    await expect(getCurrencyRates(undefined, date)).rejects.toThrow(
      "Missing arguments. Please provide both currency code and date."
    );

    await expect(getCurrencyRates(code, undefined)).rejects.toThrow(
      "Missing arguments. Please provide both currency code and date."
    );

    await expect(getCurrencyRates(undefined, undefined)).rejects.toThrow(
      "Missing arguments. Please provide both currency code and date."
    );
  });
});
