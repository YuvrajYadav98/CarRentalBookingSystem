const test = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");
const { verifySignature, verifyWebhook } = require("../src/services/paymentService");
const { esc } = require("../src/services/emailService");

const sig = (secret, data) => crypto.createHmac("sha256", secret).update(data).digest("hex");

test("checkout signature: accepts valid, rejects tampered", () => {
  const good = sig("sek", "order_1|pay_1");
  assert.equal(verifySignature("order_1", "pay_1", good, "sek"), true);
  assert.equal(verifySignature("order_1", "pay_2", good, "sek"), false);
  assert.equal(verifySignature("order_1", "pay_1", "short", "sek"), false);
  assert.equal(verifySignature("order_1", "pay_1", good, ""), false);
});
test("webhook signature uses the raw body", () => {
  const raw = Buffer.from('{"event":"payment.captured"}');
  assert.equal(verifyWebhook(raw, sig("whs", raw), "whs"), true);
  assert.equal(verifyWebhook(Buffer.from('{"event":"x"}'), sig("whs", raw), "whs"), false);
  assert.equal(verifyWebhook(raw, sig("whs", raw), ""), false);
});
test("email templates escape HTML", () => assert.equal(esc('<script>"x"&</script>'), "&lt;script&gt;&quot;x&quot;&amp;&lt;/script&gt;"));
