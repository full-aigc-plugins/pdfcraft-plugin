import test from 'node:test';
import assert from 'node:assert/strict';
import {needsFormRefresh,refreshFormFrame} from '../form-refresh.mjs';
test('only successful form fills trigger a view refresh',()=>{
 assert.equal(needsFormRefresh('form_fill',{}),true);
 assert.equal(needsFormRefresh('form_fill',{isError:true}),false);
 assert.equal(needsFormRefresh('form_fields',{}),false);
});
test('frame height is restored after two frames without navigation',async()=>{
 const jobs=[];const frame={style:{height:''},getBoundingClientRect:()=>({height:688})};
 const promise=refreshFormFrame(frame,f=>jobs.push(f));assert.equal(frame.style.height,'687px');
 assert.equal(refreshFormFrame(frame,f=>jobs.push(f)),promise);
 jobs.shift()();assert.equal(frame.style.height,'687px');jobs.shift()();await promise;
 assert.equal(frame.style.height,'');
});
test('hidden frames are left unchanged',async()=>{
 const frame={style:{height:'100%'},getBoundingClientRect:()=>({height:0})};
 await refreshFormFrame(frame,()=>assert.fail('should not schedule'));assert.equal(frame.style.height,'100%');
});
