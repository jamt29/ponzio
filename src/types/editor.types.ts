// types/editor.types.ts

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type ElementStyle = {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
};

export type ElementType = 'text' | 'table' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  style: ElementStyle;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fieldPath: string;
}

export interface TableElement extends BaseElement {
  type: 'table';
  data: any[];
  columns: {
    field: string;
    header: string;
    width: number;
    style?: ElementStyle;
  }[];
  fieldPath: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  fieldPath?: string;
}

export type EditorElement = TextElement | TableElement | ImageElement;

export interface EditorTemplate {
  elements: EditorElement[];
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}