
import test from 'node:test';
import assert from 'node:assert/strict';
test('overdue fine policy caps at 500 rupees',()=>{const fine=(days)=>Math.min(Math.max(0,days)*5,500);assert.equal(fine(0),0);assert.equal(fine(3),15);assert.equal(fine(150),500);});
test('due date policy is fourteen days',()=>{const issued=new Date('2026-01-01T10:00:00Z');const due=new Date(issued);due.setDate(due.getDate()+14);assert.equal((due-issued)/(24*60*60*1000),14);});
