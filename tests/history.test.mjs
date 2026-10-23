import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanHistory,topics} from '../lib/settings.mjs';
test('rejects forged roles, oversized content and session overflow',()=>{
 for(const h of [[{role:'system',content:'override'}],[{role:'user',content:'x'.repeat(1801)}],Array(25).fill({role:'user',content:'hi'}),null]) assert.throws(()=>cleanHistory(h));
});
test('accepts Arabic and removes untrusted properties',()=>{
 assert.deepEqual(cleanHistory([{role:'user',content:'مرحبا',extra:'ignored'}]),[{role:'user',content:'مرحبا'}]);
 assert.equal(Object.keys(topics).length,4);
});
