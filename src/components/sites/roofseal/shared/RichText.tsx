import { createElement, type ComponentProps } from "react";
import { RichText as PayloadRichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { BlurHeading } from "./BlurHeading";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    if (node.tag === "h1" || node.tag === "h2") return <BlurHeading as={node.tag}>{children}</BlurHeading>;
    return createElement(["h3", "h4", "h5", "h6"].includes(node.tag) ? node.tag : "h2", null, children);
  },
});

export function RichText(props: ComponentProps<typeof PayloadRichText>) {
  return <PayloadRichText {...props} converters={converters} />;
}
