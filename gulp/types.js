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

const typeDefGlob = path.join(schemaDir, "query.graphql");
const outputPath = path.join(outputDir, "__types__.ts");

const execTypes = async () => {
  try {
    const typeDefs = importSchema(typeDefGlob);
    const resolvers = { DateTime: GraphQLDateTime };
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    await generateTypeScriptTypes(schema, outputPath, options);
  } catch (err) {
    console.error(err);
  }
};

const watchTypes = (done) => {
  gulp.watch(typeDefGlob, execTypes);
  done();
};

gulp.task("types", gulp.series(execTypes, watchTypes));
