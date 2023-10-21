import figlet from "figlet";
import { CLI_NAME } from "@/constants.js";
import gradient from "gradient-string";

const colors = ["red", "yellow", "green", "blue", "purple"];

export const renderTitle = async () => {
  return new Promise<void>((resolve) => {
    figlet(
      CLI_NAME.replace(new RegExp("-", "g"), " ").toUpperCase(),
      {
        font: "Standard",
        horizontalLayout: "full",
      },
      (err: any, data: unknown) => {
        const sKgradient = gradient(colors);

        console.log(sKgradient.multiline((err ? CLI_NAME : data) as string));
        resolve();
      }
    );
  });
};
