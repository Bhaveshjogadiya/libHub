
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Book } from '../src/models/Book.js';
import { Category } from '../src/models/Category.js';
await connectDB();
const accounts=[
{name:'LibHub Administrator',email:'admin@libhub.local',role:'admin',avatar:'/images/avatar-admin.svg'},
{name:'Aarav Librarian',email:'librarian@libhub.local',role:'librarian',avatar:'/images/avatar-admin.svg'},
{name:'Riya Patel',email:'member@libhub.local',role:'member',avatar:'/images/avatar-member.svg',membershipNumber:'LH-DEMO001'}
];
for(const a of accounts)if(!(await User.exists({email:a.email})))await User.create({...a,passwordHash:await bcrypt.hash('ChangeMe123!',12),status:'active'});
const categories=['Fiction','Science','History','Technology','Personal Growth'];
for(const name of categories)if(!(await Category.exists({name})))await Category.create({name});
const books=[
['The Art of Reading','Fiction',1,'A thoughtful journey through stories and imagination.'],
['Minds & Ideas','Personal Growth',2,'Small ideas that change how we see the world.'],
['A Quiet World','History',3,'A reflective introduction to culture and memory.'],
['Future Thinking','Technology',4,'A friendly guide to innovation and emerging ideas.'],
['Little Stories','Fiction',5,'A collection of short stories for curious readers.'],
['Science Today','Science',6,'Accessible explanations of everyday science.']
];
for(const [title,category,n,description] of books)if(!(await Book.exists({title})))await Book.create({title,category,authors:['LibHub Editorial'],description,publisher:'LibHub Press',publicationYear:2024,language:'English',shelf:`A-0${n}`,coverImage:`/images/cover-${n}.svg`,totalCopies:4,availableCopies:4});
console.log('Seed complete. Demo password: ChangeMe123!');
await mongoose.disconnect();
