
import { Router } from 'express';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { Loan } from '../models/Loan.js';
import { Fine } from '../models/Fine.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router();
router.use(protect);
router.get('/',asyncHandler(async(req,res)=>{const filter={};if(req.user.role==='member')filter.member=req.user._id;else if(req.query.status)filter.status=req.query.status;const items=await Loan.find(filter).populate('book','title authors coverImage').populate('member','name email membershipNumber').populate('issuedBy','name').sort({createdAt:-1}).limit(200);res.json(items);}));
router.post('/issue',allowRoles('admin','librarian'),asyncHandler(async(req,res)=>{
  const {bookId,memberId}=req.body;if(!bookId||!memberId)return res.status(400).json({message:'Book and member are required.'});
  const [book,member]=await Promise.all([Book.findById(bookId),User.findOne({_id:memberId,role:'member',status:'active'})]);
  if(!book)return res.status(404).json({message:'Book not found.'});if(!member)return res.status(400).json({message:'Active member not found.'});
  if(!book.borrowingEligible)return res.status(400).json({message:'This book is not eligible for borrowing.'});
  const activeCount=await Loan.countDocuments({member:memberId,status:{$in:['active','overdue']}});
  if(activeCount>=5)return res.status(400).json({message:'Member borrowing limit of 5 active books reached.'});
  const updated=await Book.findOneAndUpdate({_id:bookId,availableCopies:{$gt:0}},{$inc:{availableCopies:-1}},{new:true});
  if(!updated)return res.status(409).json({message:'No copies are currently available.'});
  try {
    const dueAt=new Date();dueAt.setDate(dueAt.getDate()+14);
    const loan=await Loan.create({book:bookId,member:memberId,issuedBy:req.user._id,dueAt});
    res.status(201).json(await loan.populate([{path:'book',select:'title coverImage'},{path:'member',select:'name email'}]));
  } catch(err) { await Book.updateOne({_id:bookId},{$inc:{availableCopies:1}}); throw err; }
}));
router.post('/:id/return',allowRoles('admin','librarian'),asyncHandler(async(req,res)=>{
  const loan=await Loan.findOne({_id:req.params.id,status:{$in:['active','overdue']}});
  if(!loan)return res.status(404).json({message:'Active loan not found. It may already have been returned.'});
  const now=new Date();loan.returnedAt=now;loan.status='returned';
  const overdueDays=Math.max(0,Math.ceil((now-loan.dueAt)/(24*60*60*1000)));
  loan.fineAmount=Math.min(overdueDays*5,500);await loan.save();
  await Book.updateOne({_id:loan.book},{$inc:{availableCopies:1}});
  if(loan.fineAmount>0)await Fine.create({loan:loan._id,member:loan.member,amount:loan.fineAmount});
  res.json({loan,overdueDays,fineAmount:loan.fineAmount,message:'Return recorded. Fine is manually payable at the library desk.'});
}));
router.get('/member/:memberId',asyncHandler(async(req,res)=>{if(req.user.role==='member'&&String(req.user._id)!==req.params.memberId)return res.status(403).json({message:'Not allowed'});res.json(await Loan.find({member:req.params.memberId}).populate('book','title coverImage').sort({createdAt:-1}));}));
export default router;
