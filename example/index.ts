import fs from "fs";
import * as ts from "typescript";
import { schemaGenerator, typeGenerator } from "../src/main";

const inputFilePath = "input.ts";
const outputFilePath = "output.ts";

const main = () => {
  const sourceFile = ts.createSourceFile(
    inputFilePath,
    fs.readFileSync(inputFilePath).toString(),
    ts.ScriptTarget.ES2020
  );
  fs.writeFileSync(outputFilePath, "import z from 'zod';");
  sourceFile.forEachChild((child) => {
    if (ts.isInterfaceDeclaration(child)) {
      const type = typeGenerator(child, sourceFile);
      const schema = schemaGenerator(type);
      fs.appendFileSync(outputFilePath, `${schema};`);
    }
  });
};

main();
