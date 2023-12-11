import finalResultConverter from "../converters/finalResultConverter.mjs";
import finalResultMockData from "./mocks/finalResult.json" assert { type: "json" };

const tableData = await finalResultConverter(finalResultMockData,'sanook.com')

console.log(JSON.stringify(tableData))