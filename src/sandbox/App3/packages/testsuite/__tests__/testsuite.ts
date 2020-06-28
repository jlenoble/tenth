import { makeTestSuite } from "../testsuite";
import { TestSuite } from "../types";

describe("Testing TestSuite", () => {
  class Foo {
    a: number;

    constructor(a: number) {
      this.a = a;
    }

    toString() {
      return "foo";
    }

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

  class Bar extends Foo {
    b: number;

    constructor(b: number) {
      super(2);
      this.b = b;
    }

    toString() {
      return "bar";
    }

    bar(): void {
      // no-op
    }

    static barbar(): void {
      // no-op
    }
  }

  const fooTestSuite: TestSuite = {
    toString({ it }): void {
      it(done);
    },
    a({ it }): void {
      it(done);
    },
    foo({ it }): void {
      it(done);
    },
  };

  const FooTestSuite: TestSuite = {
    length({ it }): void {
      it(done);
    },
    name({ it }): void {
      it(done);
    },
    foofoo({ it }): void {
      it(done);
    },
  };

  makeTestSuite(Foo, fooTestSuite, FooTestSuite);

  const barTestSuite: TestSuite = {
    ...fooTestSuite,
    b({ it }): void {
      it(done);
    },
    bar({ it }): void {
      it(done);
    },
  };

  const BarTestSuite: TestSuite = {
    ...FooTestSuite,
    barbar({ it }): void {
      it(done);
    },
  };

  makeTestSuite(Bar, barTestSuite, BarTestSuite);
});
