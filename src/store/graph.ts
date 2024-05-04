import { makeAutoObservable } from "mobx";
import { GraphThemeProps } from "./type";

export class GraphTheme {
  // px
  graphHeight: GraphThemeProps["graphHeight"] = 300;
  graphBackground: GraphThemeProps["graphBackground"] = "#c8c8c8";

  constructor() {
    makeAutoObservable(this);
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
