import ts from "typescript";
import { SchemaType } from "./types";

export const SyntaxKindToSchemaTypeMapping = {
  [ts.SyntaxKind.StringKeyword]: SchemaType.String,
  [ts.SyntaxKind.NumberKeyword]: SchemaType.Number,
  [ts.SyntaxKind.BigIntKeyword]: SchemaType.BigInt,
  [ts.SyntaxKind.BooleanKeyword]: SchemaType.Boolean,
  [ts.SyntaxKind.UndefinedKeyword]: SchemaType.Undefined,
  [ts.SyntaxKind.NullKeyword]: SchemaType.Null,
  [ts.SyntaxKind.Unknown]: SchemaType.Unknown,
  [ts.SyntaxKind.NeverKeyword]: SchemaType.Never,
  [ts.SyntaxKind.AnyKeyword]: SchemaType.Any,
  [ts.SyntaxKind.StringLiteral]: SchemaType.StringLiteral,
  [ts.SyntaxKind.NumericLiteral]: SchemaType.NumberLiteral,
  [ts.SyntaxKind.BigIntLiteral]: SchemaType.BigIntLiteral,
};
