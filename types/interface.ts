import { Component } from "grapesjs";
import { E3DViewerAttribute } from "./enum";

export type ThreeViewerAttributes = { [x in E3DViewerAttribute]: string };

export interface ThreeViewerModel extends Component {
  getAttributes(): ThreeViewerAttributes;
}

export interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
}
