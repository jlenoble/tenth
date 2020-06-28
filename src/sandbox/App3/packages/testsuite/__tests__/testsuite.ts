import { makeTestSuite } from "../testsuite";

describe("Testing TestSuite", () => {
  class Foo {
    toString() {
      return "foo";
    }

    a = 3;

    foo(): void {
      // no-op
    }

    static foofoo(): void {
      // no-op
    }
  }

  const done = () => {
    // Done !
  };

  class Bar {
    toString() {
      return "bar";
    }

    b = 8;

    bar(): void {
      // no-op
    }

    static barbar(): void {
      // no-op
    }
  }

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
      foofoo({ it }): void {
        it(done);
      },
    }
  );

  makeTestSuite(
    Bar,
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
      foofoo({ it }): void {
        it(done);
      },
    }
  );
});
