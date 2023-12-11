import webVitalsConverter from "../converters/webVitalsConverter.mjs";
import webvitalsMockData from "./mocks/webvitals.json" assert { type: "json" };

console.log(await webVitalsConverter(webvitalsMockData))