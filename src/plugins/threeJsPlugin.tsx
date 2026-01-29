"use client";
import { ThreeJSViewer } from "@/components/Grapesjs3JSViewer";
import type { Editor } from "grapesjs";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { ThreeViewerModel } from "../../types/interface";
import { E3DViewerAttribute } from "../../types/enum";

export const ThreeJs3DViewerStudioPlugin = (editor: Editor) => {
  editor.Components.addType("3d-model-viewer", {
    model: {
      defaults: {
        attributes: {
          [E3DViewerAttribute.DATA_MODEL_SCALE]: "1",
          [E3DViewerAttribute.DATA_BG_COLOR]: "#ffffff",
          [E3DViewerAttribute.DATA_CAMERA_POS_X]: "0",
          [E3DViewerAttribute.DATA_CAMERA_POS_Y]: "0.5",
          [E3DViewerAttribute.DATA_CAMERA_POS_Z]: "2.5",
        },

        traits: [
          {
            type: "number",
            label: "Model Scale",
            name: E3DViewerAttribute.DATA_MODEL_SCALE,
            min: 0.1,
            max: 5,
            step: 0.1,
            changeProp: true,
          },
          {
            type: "color",
            label: "Background Color",
            name: E3DViewerAttribute.DATA_BG_COLOR,
            changeProp: true,
          },
          {
            name: E3DViewerAttribute.DATA_CAMERA_POS_X,
            label: "Camera Position X",
            type: "number",
            category: "Camera Position", // This creates the group
            changeProp: true,
          },
          {
            name: E3DViewerAttribute.DATA_CAMERA_POS_Y,
            label: "Camera Position Y",
            type: "number",
            category: "Camera Position", // Must match exactly
            changeProp: true,
          },
          {
            name: E3DViewerAttribute.DATA_CAMERA_POS_Z,
            label: "Camera Position Z",
            type: "number",
            category: "Camera Position", // Must match exactly
            changeProp: true,
          },
        ],
      },
    },

    view: {
      reactRoot: null as Root | null,
      init() {
        // Listen to model events
        [
          "change:data-model-scale",
          "change:data-bg-color",
          "change:data-camera-pos-x",
          "change:data-camera-pos-y",
          "change:data-camera-pos-z",
        ].forEach((name) => this.listenTo(this.model, name, this.renderReact));
      },

      updateImageWithTitle() {
        console.log({ scale: "it got changed" });
      },

      renderReact() {
        const el = this.el as HTMLElement;
        const model = this.model as ThreeViewerModel;

        if (!this.reactRoot) {
          const container = document.createElement("div");
          container.style.width = "100%";
          container.style.height = "100%";
          el.appendChild(container);
          this.reactRoot = createRoot(container);
        }

        const props = model.get("props") || {};
        const attrs = model.getAttributes();
        console.log({ props, attrs });

        const viewerConfig = {
          [E3DViewerAttribute.DATA_BG_COLOR]:
            this.model.get(E3DViewerAttribute.DATA_BG_COLOR) || "#ffffff",
          [E3DViewerAttribute.DATA_MODEL_SCALE]: parseFloat(
            this.model.get(E3DViewerAttribute.DATA_MODEL_SCALE) || 1,
          ),
          [E3DViewerAttribute.DATA_CAMERA_POS_X]: parseFloat(
            this.model.get(E3DViewerAttribute.DATA_CAMERA_POS_X) || 0,
          ),
          [E3DViewerAttribute.DATA_CAMERA_POS_Y]: parseFloat(
            this.model.get(E3DViewerAttribute.DATA_CAMERA_POS_Y) || 0.5,
          ),
          [E3DViewerAttribute.DATA_CAMERA_POS_Z]: parseFloat(
            this.model.get(E3DViewerAttribute.DATA_CAMERA_POS_Z) || 2.5,
          ),
        };

        this.reactRoot.render(
          <React.StrictMode>
            <ThreeJSViewer {...viewerConfig} />
          </React.StrictMode>,
        );
      },
      onRender() {
        this.renderReact();
      },

      onRemove() {
        this.reactRoot?.unmount();
      },
    },
  });

  editor.Blocks.add("3d-viewer-block", {
    label: "3D Model Viewer",
    category: "3D",
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>',
    content: { type: "3d-model-viewer" },
  });
};
