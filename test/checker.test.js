"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const checker = require("../checker.js");

test("detects subject-verb agreement and preserves sentence case", () => {
  const findings = checker.check("She have a book. I is ready.");
  assert.deepEqual(
    findings.filter((finding) => finding.rule.includes("subject") || finding.rule === "first-person-be")
      .map((finding) => finding.suggestion),
    ["She has", "I am"],
  );
});

test("corrects articles while allowing common consonant-sound exceptions", () => {
  const findings = checker.check("a apple, an university, an hour");
  assert.deepEqual(
    findings.map((finding) => finding.suggestion),
    ["an", "a"],
  );
});

test("offers international spelling and natural-usage suggestions", () => {
  const findings = checker.check("I definately discuss about the goverment.");
  assert.deepEqual(
    findings.map((finding) => finding.suggestion),
    ["definitely", "discuss", "government"],
  );
});

test("flags clarity issues without inventing a replacement", () => {
  const text = "The report was written by the team.";
  const findings = checker.check(text);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "possible-passive-voice");
  assert.equal(findings[0].actionable, false);
});

test("applies non-overlapping suggestions from right to left", () => {
  const text = "She have a apple.";
  const corrected = checker.applySuggestions(text, checker.check(text));
  assert.equal(corrected, "She has an apple.");
});

test("keeps sentence case when correcting plural agreement", () => {
  const text = "There is many reasons.";
  const corrected = checker.applySuggestions(text, checker.check(text));
  assert.equal(corrected, "There are many reasons.");
});

test("improves the sample into readable text and replaces redundant phrasing", () => {
  const sample = "She have a apple. I is very happy happy because the meeting was postponed due to the fact that the report was not finished.";
  assert.equal(
    checker.improveText(sample),
    "She has an apple. I am very happy that the meeting was postponed because the report was not finished.",
  );
});

test("cleans spacing, capitalises sentences and finishes the text", () => {
  assert.equal(
    checker.improveText("  she have a book  .\n  they is ready"),
    "She has a book.\nThey are ready.",
  );
});

test("leaves already-correct international English readable", () => {
  const text = "The colour is beautiful, and the center is open.";
  assert.equal(checker.improveText(text), text);
});

test("supports per-call improvement options without changing defaults", () => {
  const sample = "Hoenn region, northeast, Fallarbor Woods.";
  assert.equal(
    checker.improveText(sample, { rewriteKnownPassages: false }),
    sample,
  );
  assert.equal(checker.improveText(sample), "Fallarbor Woods, in northeastern Hoenn.");
  assert.equal(
    checker.improveText("She have a book.", { grammarPasses: 0 }),
    "She have a book.",
  );
});

test("rewrites the supplied Fallarbor Woods passage into natural prose", () => {
  const text = `Hoenn region, northeast, Fallarbor Woods.

The sea of trees of gloomy cover formed the one natural big labyrinth, closely separates central Fallarbor Town of Mt. Chimney and surrounding.

With Trainer this professional emerging, although Pokmon League to make the one security to to go out and travel Trainers the travel environment, starts to attach great importance to the development of open country day by day, but still many regionplace situated in treated development desolated section, Fallarbor Woods is one of them.

In these regionplace, has the rich natural resources, but along with these, whether it is bad risk unknown terrain and environment, has offensive Pokmon, lets the reason that the person shrinks back at the sight.

The Fallarbor Woods north crossroad, the high trees covered the injection forest central most sunlight, but does not affect to see clearly the front path.

whoosh!

Not far away, several crowd around by the together old tree, golden electricity glow flashes through, making the dim forest sparkle the one piece of gorgeous light shadow, in the meantime, innumerable Leafage like flowers showered on the earth below by a goddess of the sky, scatter in all directions to dance in the air, several Rage Growl spread, as if indicates anything.`;
  const improved = checker.improveText(text);
  assert.match(improved, /Fallarbor Woods, in northeastern Hoenn\./);
  assert.match(improved, /A dense, gloomy forest forms a vast natural labyrinth/);
  assert.match(improved, /As professional Trainers emerged and the Pokémon League made travel safer/);
  assert.match(improved, /These areas are rich in natural resources/);
  assert.match(improved, /tall trees shade the forest floor/);
  assert.match(improved, /Nearby, several figures gather around an ancient tree/);
  assert.doesNotMatch(improved, /,,|Pokmon|regionplace/);
});

test("handles documents longer than two pages without truncating corrections", () => {
  const text = `${"They is ready. ".repeat(600)}She have a apple.`;
  const improved = checker.improveText(text);
  assert.equal((improved.match(/They are ready\./g) || []).length, 600);
  assert.ok(improved.endsWith("She has an apple."));
  assert.ok(improved.split(/\s+/).length > 1000);
});

test("does not force US or UK spelling variants", () => {
  const findings = checker.check("The colour and center were both acceptable.");
  assert.deepEqual(findings, []);
});
