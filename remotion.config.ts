import { Config } from "remotion";
import { webpackOverride } from "./remotion/webpack-override";

Config.Rendering.setImageFormat("jpeg");
Config.Output.setOverwriteOutput(true);

Config.Bundling.overrideWebpackConfig(webpackOverride);

Config.Preview.setMaxTimelineTracks(40);
