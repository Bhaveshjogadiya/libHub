
import { Router } from 'express';
import { Fine } from '../models/Fine.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router();router.use(protect);
router.get('/',asyncHandler(async(req,res)=>{const filter=req.user.role==='member'?{member:req.user._id}:{};res.json(await Fine.find(filter).populate('member','name email').populate({path:'loan',populate:{path:'book',select:'title'}}).sort({createdAt:-1}));}));
router.post('/:id/pay',allowRoles('admin','librarian'),asyncHandler(async(req,res)=>{const amount=Number(req.body.amount);if(!Number.isFinite(amount)||amount<=0)return res.status(400).json({message:'Enter a valid payment amount.'});const fine=await Fine.findById(req.params.id);if(!fine)return res.status(404).json({message:'Fine not found'});if(fine.status==='waived')return res.status(400).json({message:'Waived fine cannot be paid.'});fine.paidAmount=Math.min(fine.amount,fine.paidAmount+amount);fine.status=fine.paidAmount>=fine.amount?'paid':'partially_paid';await fine.save();res.json({fine,message:'Manual payment record saved. No online payment was processed.'});}));
router.post('/:id/waive',allowRoles('admin'),asyncHandler(async(req,res)=>{const fine=await Fine.findByIdAndUpdate(req.params.id,{status:'waived',note:String(req.body.note||'Waived by admin').slice(0,300)},{new:true});if(!fine)return res.status(404).json({message:'Fine not found'});res.json(fine);}));
export default router;
