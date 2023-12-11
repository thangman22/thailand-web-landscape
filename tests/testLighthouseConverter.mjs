import lightHouseConverter from "../converters/lightHouseConverter.mjs";
import lightHouseMockData from "./mocks/lighthouse.json" assert { type: "json" };

console.log(await lightHouseConverter(lightHouseMockData))