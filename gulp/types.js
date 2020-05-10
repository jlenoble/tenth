import gulp from "gulp";
import path from "path";
import { generateTypeScriptTypes } from "graphql-schema-typescript";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLDateTime } from "graphql-iso-date";
import { srcDir } from "./helpers/dirs";

const schemaDir = path.join(srcDir, "sandbox/App2/graphql-schemas");
const outputDir = path.join(srcDir, "sandbox/App2");
const options = {};

gulp.task("types", async () => {
  return Promise.all(
    ["**/*"].map(async (name) => {
      try {
        const typeDefGlob = path.join(schemaDir, name + ".graphql");
        const typeDefs = importSchema(typeDefGlob);
        const resolvers = { DateTime: GraphQLDateTime };

        const schema = makeExecutableSchema({ typeDefs, resolvers });
        const outputPath = path.join(outputDir, "__types__.ts");

        await generateTypeScriptTypes(schema, outputPath, options);
      } catch (err) {
        console.error(err);
      }
    })
  );
});
