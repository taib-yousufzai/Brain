import { PARSED_PUBLIC_TOOLS } from './fileParser';
import { runAdversarialTestSuite } from './testIntelligence';

console.log('====================================================');
console.log('   RUNNING ADVERSARIAL INTELLIGENCE TEST SUITE      ');
console.log('====================================================\n');

const testCases = runAdversarialTestSuite(PARSED_PUBLIC_TOOLS);

let passedCount = 0;
let failedCount = 0;

testCases.forEach((tc) => {
  if (tc.passed) {
    passedCount++;
    console.log(`✅ TEST ${tc.id}: PASSED - ${tc.description}`);
  } else {
    failedCount++;
    console.log(`❌ TEST ${tc.id}: FAILED - ${tc.description}`);
    console.log(`   Actual:   ${tc.actual}`);
    console.log(`   Expected: ${tc.expected}\n`);
  }
});

console.log('\n====================================================');
console.log(`SUMMARY: ${passedCount}/${testCases.length} Tests Passed`);
console.log('====================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🚀 ALL 20 ADVERSARIAL INTELLIGENCE TESTS PASSED PERFECTLY!');
  process.exit(0);
}
