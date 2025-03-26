import { system } from "@minecraft/server";

export default (ticks: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    system.runTimeout(() => {
      resolve(ticks);
    });
  });
};
