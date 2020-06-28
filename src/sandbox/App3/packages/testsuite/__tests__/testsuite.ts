import { makeTestSuite } from "../testsuite";

describe("Testing TestSuite", () => {
  class Foo {
    toString() {
      return "bobo";
    }

    a = 3;

    foo(): void {
      // no-op
    }

    static bar(): void {
      // no-op
    }
  }

  const done = () => {
    // Done !
  };

  makeTestSuite(
    Foo,
    {
      toString({ it }): void {
        it(done);
      },
      a({ it }): void {
        it(done);
      },
      foo({ it }): void {
        it(done);
      },
    },
    {
      length({ it }): void {
        it(done);
      },
      name({ it }): void {
        it(done);
      },
      bar({ it }): void {
        it(done);
      },
    }
  );
});
