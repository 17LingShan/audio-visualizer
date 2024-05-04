import { makeAutoObservable } from "mobx";
import { GraphThemeProps } from "./type";

export class GraphTheme {
  graphHeight: GraphThemeProps["graphHeight"] = 300;
  graphBackground: GraphThemeProps["graphBackground"] = "#c8c8c8";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get getTheme() {
    return {
      graphHeight: this.graphHeight,
      graphBackground: this.graphBackground,
    };
  }
}

const GraphThemeStore = new GraphTheme();
export default GraphThemeStore;
