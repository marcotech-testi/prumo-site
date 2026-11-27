import { describe, expect, it } from "vitest";
import { serverEnv } from "@/lib/env";

describe("env", () => {
  it("aceita ambiente de desenvolvimento sem chaves", () => {
    expect(() => serverEnv()).not.toThrow();
  });
});
