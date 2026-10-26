
import { Router } from 'express';
import { Reservation } from '../models/Reservation.js';
import { Book } from '../models/Book.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router();router.use(protect);
router.get('/',asyncHandler(async(req,res)=>{const filter=req.user.role==='member'?{member:req.user._id}:{};res.json(await Reservation.find(filter).populate('book','title coverImage availableCopies').populate('member','name email').sort({createdAt:-1}).limit(200));}));
router.post('/',asyncHandler(async(req,res)=>{const {bookId}=req.body;if(!bookId)return res.status(400).json({message:'Book is required'});const book=await Book.findById(bookId);if(!book)return res.status(404).json({message:'Book not found'});if(await Reservation.exists({book:bookId,member:req.user._id,status:{$in:['queued','ready']}}))return res.status(409).json({message:'You already have an active reservation for this book.'});const queuePosition=(await Reservation.countDocuments({book:bookId,status:'queued'}))+1;const reservation=await Reservation.create({book:bookId,member:req.user._id,queuePosition,status:book.availableCopies>0?'ready':'queued',expiresAt:book.availableCopies>0?new Date(Date.now()+48*3600000):undefined});res.status(201).json(reservation);}));
router.patch('/:id/cancel',asyncHandler(async(req,res)=>{const filter={_id:req.params.id,status:{$in:['queued','ready']}};if(req.user.role==='member')filter.member=req.user._id;const item=await Reservation.findOneAndUpdate(filter,{status:'cancelled'},{new:true});if(!item)return res.status(404).json({message:'Eligible reservation not found'});res.json(item);}));
router.patch('/:id/fulfill',allowRoles('admin','librarian'),asyncHandler(async(req,res)=>{const item=await Reservation.findOneAndUpdate({_id:req.params.id,status:'ready'},{status:'fulfilled'},{new:true});if(!item)return res.status(404).json({message:'Ready reservation not found'});res.json(item);}));
export default router;
