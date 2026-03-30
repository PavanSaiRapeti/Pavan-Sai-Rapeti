import React from "react";
import ReactIcon from "./svg/ReactIcon";
import JavascriptIcon from "./svg/JavascriptIcon";
import TypescriptIcon from "./svg/TypescriptIcon";
import NextJSIcon from "./svg/NextJSIcon";
import ReduxIcon from "./svg/ReduxIcon";
import TailwindcssIcon from "./svg/TailwindcssIcon";
import ExpressJSIcon from "./svg/ExpressJSIcon";
import NodejsIcon from "./svg/NodejsIcon";
import MongoDBIcon from "./svg/MongoDBIcon";
import BlenderIcon from "./svg/BlenderIcon";
import AwsIcon from "./svg/AwsIcon";
import HtmlIcon from "./svg/HtmlIcon";
import CssIcon from "./svg/CssIcon";

const iconMap = {
  React: ReactIcon,
  Javascript: JavascriptIcon,
  Typescript: TypescriptIcon,
  NextJS: NextJSIcon,
  Redux: ReduxIcon,
  Tailwindcss: TailwindcssIcon,
  Expressjs: ExpressJSIcon,
  Nodejs: NodejsIcon,
  MongoDB: MongoDBIcon,
  Blender: BlenderIcon,
  Aws: AwsIcon,
  Html: HtmlIcon,
  Css: CssIcon,
};

/**
 * @param {string} [layout] "center" (default) — no offset; use inside flex-centered bubbles.
 *        "offset" keeps legacy top/left nudge for one-off layouts.
 */
export const Icon = ({
  Name,
  width = "75",
  height = "75",
  layout = "center",
}) => {
  const Component = iconMap[Name];
  if (!Component) return null;

  const wrapClass =
    layout === "offset"
      ? "absolute top-12 left-12"
      : "inline-flex items-center justify-center leading-none [&_svg]:block [&_img]:block [&_svg]:shrink-0 [&_img]:shrink-0";

  return (
    <div className={wrapClass}>
      <Component width={width} height={height} />
    </div>
  );
};
