import React from 'react';
import ReactIcon from './svg/ReactIcon';
import JavascriptIcon from './svg/JavascriptIcon';
import TypescriptIcon from './svg/TypescriptIcon';
import NextJSIcon from './svg/NextJSIcon';
import ReduxIcon from './svg/ReduxIcon';
import TailwindcssIcon from './svg/TailwindcssIcon';
import ExpressJSIcon from './svg/ExpressJSIcon';
import NodejsIcon from './svg/NodejsIcon';
import MongoDBIcon from './svg/MongoDBIcon';
import BlenderIcon from './svg/BlenderIcon';
import AwsIcon from './svg/AwsIcon';
import HtmlIcon from './svg/HtmlIcon';
import CssIcon from './svg/CssIcon';

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

export const Icon = ({ Name, width = "75", height = "75" }) => {
  const Component = iconMap[Name];

  return (
    <div className="absolute top-12 left-12">
      {Component ? <Component width={width} height={height} /> : null}
    </div>
  );
};
