import wappalyzerConverter from "../converters/wappalyzerConverter.mjs";
import wappalyzerMockData from "./mocks/wappalyzer.json" assert { type: "json" };

console.log(await wappalyzerConverter(wappalyzerMockData))