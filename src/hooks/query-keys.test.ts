import { describe, it, expect } from "vitest";
import { svgrKeys } from "./query-keys";

describe("svgrKeys", () => {
  it("has all key as base", () => {
    expect(svgrKeys.all).toEqual(["svgr"]);
  });

  it("convert key extends all", () => {
    expect(svgrKeys.convert()).toEqual(["svgr", "convert"]);
  });

  it("job key extends jobs", () => {
    expect(svgrKeys.job("j1")).toEqual(["svgr", "jobs", "j1"]);
  });

  it("imageJobs key extends jobs", () => {
    expect(svgrKeys.imageJobs("i1")).toEqual(["svgr", "jobs", "image", "i1"]);
  });
});
