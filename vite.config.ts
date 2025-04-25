import { defineConfig } from "vite";
import string from "vite-plugin-string";

export default defineConfig({
  plugins: [
    string({
      include: ["**/*.hbs"], // Import .hbs files as raw strings
    }),
  ],
});
