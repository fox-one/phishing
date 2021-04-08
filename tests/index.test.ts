import { expect } from "chai";
import { checkIfDenied } from "../src/index";

describe("checkIfDenied", (): void => {
  it("returns false when host is not listed", async (): Promise<void> => {
    expect(await checkIfDenied("fox.one")).eq(false);
  });

  it("returns false then host is not listed (with protocol)", async (): Promise<void> => {
    expect(await checkIfDenied("https://fox.one")).eq(false);
  });

  it("returns true when host in list", async (): Promise<void> => {
    expect(await checkIfDenied("phishing.fox.one")).eq(true);
  });

  it("returns true when host in list (www-prefix)", async (): Promise<void> => {
    expect(await checkIfDenied("www.phishing.fox.one")).eq(true);
  });

  it("returns true when host in list (protocol)", async (): Promise<void> => {
    expect(await checkIfDenied("https://phishing.fox.one")).eq(true);
  });

  it("returns true when host in list (protocol + path)", async (): Promise<void> => {
    expect(
      await checkIfDenied("https://phishing.fox.one/something/index.html")
    ).eq(true);
  });
});
