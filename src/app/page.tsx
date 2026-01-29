"use client";
import StudioEditor from "@grapesjs/studio-sdk/react";
import { ThreeJs3DViewerStudioPlugin } from "@/plugins/threeJsPlugin";
import grapeTailwindcssPlugin from "grapesjs-tailwindcss-plugin";

export default function Page() {
  return (
    <StudioEditor
      style={{ height: "100vh" }}
      options={{
        licenseKey: "",
        project: {
          type: "web",
          default: {
            pages: [
              {
                name: "Dashbord",
                component:
                  "<h1>Editor-driven 3D integration, GrapesJS editor state + Three.js viewer</h1>",
              },
            ],
          },
        },

        plugins: [
          ThreeJs3DViewerStudioPlugin,
          (editor) => {
            grapeTailwindcssPlugin(editor, {
              autocomplete: false,
            });
          },
        ],
      }}
    />
  );
}
