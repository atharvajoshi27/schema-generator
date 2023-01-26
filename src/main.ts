import { SyntaxKindToSchemaTypeMapping } from "./constants";
import { InputType, SchemaType } from "./types";
import ts from "typescript";

const withOptional = (val: any, optional?: boolean) =>
  `${val}${optional ? ".optional()" : ""}`;

export const typeGenerator = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): InputType => {
  switch (node.kind) {
    case ts.SyntaxKind.StringKeyword:
    case ts.SyntaxKind.NumberKeyword:
    case ts.SyntaxKind.BooleanKeyword:
    case ts.SyntaxKind.BigIntKeyword:
    case ts.SyntaxKind.UndefinedKeyword:
    case ts.SyntaxKind.NullKeyword:
    case ts.SyntaxKind.AnyKeyword:
      return { kind: SyntaxKindToSchemaTypeMapping[node.kind] };
  }

  if (ts.isInterfaceDeclaration(node))
    return {
      kind: SchemaType.Interface,
      name: node.name.getText(sourceFile),
      value: node.members.reduce(
        (prev, member) => ({ ...prev, ...typeGenerator(member, sourceFile) }),
        {} as InputType
      ),
    };

  if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
    return {
      kind: SchemaType.TypeReference,
      value: `${node.getText(sourceFile)}Schema`,
    };
  }

  if (ts.isTypeLiteralNode(node)) {
    // difference between TypeLiteral => type is mentioned as literal e.g. { a: string; b?: number } etc
    return {
      kind: SchemaType.Object,
      value: node.members.reduce(
        (prev, member) => ({
          ...prev,
          ...typeGenerator(member, sourceFile),
        }),
        {} as InputType
      ),
    };
  }
  if (ts.isLiteralTypeNode(node)) {
    if (
      ts.isStringLiteral(node.literal) ||
      ts.isNumericLiteral(node.literal) ||
      ts.isBigIntLiteral(node.literal)
    )
      return {
        kind: SyntaxKindToSchemaTypeMapping[node.literal.kind],
        value:
          node.literal.kind === ts.SyntaxKind.StringLiteral
            ? `"${node.literal.text}"`
            : node.literal.text,
      };
    return {
      kind: SchemaType.Literal,
      value: (node.literal as any).text,
    };
  }

  if (ts.isUnionTypeNode(node)) {
    const value: any = [];
    node.types.forEach((type) => {
      value.push(typeGenerator(type, sourceFile));
    });
    return { kind: SchemaType.Union, value };
  }

  if (
    ts.isPropertySignature(node) &&
    ts.isIdentifier(node.name) &&
    node.name &&
    node.type
  ) {
    const name = node.name.getText(sourceFile);
    if (node.type)
      return {
        [name]: {
          ...typeGenerator(node.type, sourceFile),
          optional: !!node.questionToken,
        },
      };
  }
  return {};
};

export const schemaGenerator = (type: InputType): any => {
  switch (type.kind) {
    case SchemaType.String:
      return "z.string()";
    case SchemaType.Number:
      return "z.number()";
    case SchemaType.Boolean:
      return "z.boolean()";
    case SchemaType.BigInt:
      return "z.bigint()";
    case SchemaType.StringLiteral:
    case SchemaType.BigIntLiteral:
    case SchemaType.NumberLiteral:
      return `z.literal(${type.value})`;
    case SchemaType.TypeReference:
      return type.value;
    case SchemaType.Interface:
      return (
        `const ${type.name}Schema = z.object({` +
        Object.entries(type.value as any)
          .map(([key, val]: any) => `${key}: ${schemaGenerator(val)}`)
          .join(", ") +
        "}).strict()"
      );

    case SchemaType.Object:
      return withOptional(
        "z.object({" +
          Object.entries(type.value as any)
            .map(
              ([key, val]: any) =>
                `${key}: ${withOptional(schemaGenerator(val), val.optional)}`
            )
            .join(", ") +
          "}).strict()",
        type?.optional
      );

    case SchemaType.Union:
      return withOptional(
        "z.union([" +
          (type.value as any)
            .map((val: any) => schemaGenerator(val))
            .join(", ") +
          "])",
        type.optional
      );
      break;
  }
};
