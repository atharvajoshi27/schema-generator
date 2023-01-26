import ts from "typescript";

export function createEnumWithMarkerToString<T extends number = number>(
  enumeration: any
) {
  const map: Map<number, string> = new Map();
  for (let name in enumeration) {
    const id = enumeration[name];
    if (typeof id === "number" && !map.has(id)) {
      map.set(id, name);
    }
  }
  return (value: T) => map.get(value) as string; //could be undefined if used the wrong enum member..
}

export const syntaxKindToString = createEnumWithMarkerToString<ts.SyntaxKind>(
  ts.SyntaxKind
);

export const recursiveReplace = (obj: any) => {
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) obj[i] = recursiveReplace(obj[i]);
  } else
    for (const key of Object.keys(obj)) {
      if (
        [
          "pos",
          "end",
          "flags",
          "modifiedFlagsCache",
          "transformFlags",
          "hasTrailingComma",
          "leadingComments",
          "trailingComments",
          "modifierFlagsCache",
          "hasExtendedUnicodeEscape",
        ].includes(key)
      )
        delete obj[key];

      if (typeof obj[key] === "number" && key === "kind") {
        obj[key] = syntaxKindToString(obj[key]);
      } else if (typeof obj[key] === "object")
        obj[key] = recursiveReplace(obj[key]);
    }
  return obj;
};

export const print = (obj: any) =>
  console.log(
    JSON.stringify(recursiveReplace(Object.assign({}, obj)), null, 4)
  );
