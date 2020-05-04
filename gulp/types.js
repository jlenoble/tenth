import gulp from "gulp";
import path from "path";
import { generateTypeScriptTypes } from "graphql-schema-typescript";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { srcDir } from "./helpers/dirs";

const schemaDir = path.join(srcDir, "sandbox/apollo-tutorial/schemas");
const outputDir = path.join(srcDir, "sandbox/apollo-tutorial/__types__");
const options = {};

gulp.task("types", async () => {
  return Promise.all(
    ["spacex-schema", "schema"].map((name) => {
      try {
        const typeDefGlob = path.join(schemaDir, name + ".graphql");
        const typeDefs = importSchema(typeDefGlob);
        const resolvers = {};
        const schema = makeExecutableSchema({ typeDefs, resolvers });
        const outputPath = path.join(outputDir, name + ".ts");

        return generateTypeScriptTypes(schema, outputPath, options);
      } catch (err) {
        return Promise.reject(err);
      }
    })
  );
});
