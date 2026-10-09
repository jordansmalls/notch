import assert from "node:assert/strict";
import { test } from "node:test";
import Counter from "../src/models/counter.model.js";
import { updateCounter } from "../src/controllers/counter.controller.js";

const ownerId = "507f1f77bcf86cd799439011";
const originalDate = new Date("2025-01-10T12:00:00Z");

async function update(body, userId = ownerId) {
  const counter = Counter.hydrate({
    _id: "507f1f77bcf86cd799439012", user_id: ownerId,
    name: "Visits", description: "Site visits", count: 42,
    public_key: "test-key", createdAt: originalDate,
  });
  let saved = false;
  counter.save = async () => {
    await counter.validate();
    saved = true;
    return counter;
  };
  const originalFind = Counter.findById;
  Counter.findById = async () => counter;
  const response = {
    status(code) { this.code = code; return this; },
    json(data) { this.data = data; return this; },
  };
  try {
    await updateCounter({ body: { id: counter.id, name: "Visits", description: "Updated", ...body }, user: { _id: userId } }, response);
    return { response, counter, saved };
  } finally {
    Counter.findById = originalFind;
  }
}

test("owner can set count to zero and change the creation date", async () => {
  const { response, counter, saved } = await update({ count: 0, createdAt: "2024-06-15T04:00:00.000Z" });
  assert.equal(response.code, 200);
  assert.equal(saved, true);
  assert.equal(response.data.counter.count, 0);
  assert.equal(counter.createdAt.toISOString(), "2024-06-15T04:00:00.000Z");
  assert.equal(counter.getChanges().$set.createdAt.toISOString(), "2024-06-15T04:00:00.000Z");
});

test("omitting optional fields preserves the count and date", async () => {
  const { response, counter } = await update({});
  assert.equal(response.code, 200);
  assert.equal(counter.count, 42);
  assert.deepEqual(counter.createdAt, originalDate);
  assert.equal(counter.getChanges().$set.count, undefined);
});

test("invalid counts and dates cannot be saved", async () => {
  for (const body of [
    { count: -1 }, { count: 1.5 }, { count: "12" }, { count: null },
    { count: Number.MAX_SAFE_INTEGER + 1 }, { createdAt: "bad-date" },
    { createdAt: "" }, { createdAt: null },
  ]) {
    const { response, saved } = await update(body);
    assert.equal(response.code, 400);
    assert.equal(saved, false);
  }
});

test("another user cannot change the count or date", async () => {
  const { response, saved } = await update({ count: 10, createdAt: "2024-01-01" }, "507f1f77bcf86cd799439099");
  assert.equal(response.code, 403);
  assert.equal(saved, false);
});
