
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Book } from '../models/Book.js';
import { Loan } from '../models/Loan.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
const validate = (req,res,next) => { const e=validationResult(req); if(!e.isEmpty()) return res.status(400).json({message:'Validation failed',errors:e.array()}); next(); };
router.get('/', asyncHandler(async (req,res) => {
  const page=Math.max(1,Number(req.query.page)||1), limit=Math.min(50,Math.max(1,Number(req.query.limit)||12));
  const filter={};
  if(req.query.category) filter.category=req.query.category;
  if(req.query.available==='true') filter.availableCopies={$gt:0};
  if(req.query.q) filter.$text={$search:String(req.query.q).slice(0,100)};
  const sort=req.query.sort==='title' ? {title:1} : req.query.sort==='popular' ? {updatedAt:-1} : {createdAt:-1};
  const [items,total]=await Promise.all([Book.find(filter).sort(sort).skip((page-1)*limit).limit(limit),Book.countDocuments(filter)]);
  res.json({items,total,page,pages:Math.ceil(total/limit)});
}));
router.get('/:id', asyncHandler(async (req,res)=>{ const book=await Book.findById(req.params.id); if(!book)return res.status(404).json({message:'Book not found'}); res.json(book); }));
router.post('/', [body('title').trim().notEmpty(),body('totalCopies').isInt({min:1})], validate, asyncHandler(async(req,res)=>{
  const data={...req.body,availableCopies:req.body.availableCopies ?? req.body.totalCopies};
  const book=await Book.create(data); res.status(201).json(book);
}));
router.patch('/:id', protect, allowRoles('admin','librarian'), asyncHandler(async(req,res)=>{
  const book=await Book.findById(req.params.id); if(!book)return res.status(404).json({message:'Book not found'});
  const allowed=['title','isbn','subtitle','description','authors','category','publisher','publicationYear','language','edition','shelf','coverImage','totalCopies','borrowingEligible'];
  for(const key of allowed) if(req.body[key]!==undefined) book[key]=req.body[key];
  const active=await Loan.countDocuments({book:book._id,status:{$in:['active','overdue']}});
  if(book.totalCopies<active) return res.status(400).json({message:'Total copies cannot be lower than the number currently on loan.'});
  book.availableCopies=Math.max(0,book.totalCopies-active); await book.save(); res.json(book);
}));
router.delete('/:id', protect, allowRoles('admin'), asyncHandler(async(req,res)=>{
  const active=await Loan.exists({book:req.params.id,status:{$in:['active','overdue']}});
  if(active)return res.status(409).json({message:'Cannot delete a book with active loans.'});
  const book=await Book.findByIdAndDelete(req.params.id); if(!book)return res.status(404).json({message:'Book not found'}); res.json({message:'Book deleted'});
}));
export default router;
