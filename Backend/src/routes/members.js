
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { Loan } from '../models/Loan.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router();
const validate=(req,res,next)=>{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:'Please check the submitted fields.',errors:errors.array()});next();};
router.use(protect,allowRoles('admin','librarian'));
router.get('/',asyncHandler(async(req,res)=>{const page=Math.max(1,Number(req.query.page)||1),limit=Math.min(50,Number(req.query.limit)||20);const filter={role:'member'};if(req.query.q)filter.$or=[{name:new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')},{email:new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')}];const [items,total]=await Promise.all([User.find(filter).select('-passwordHash').sort({createdAt:-1}).skip((page-1)*limit).limit(limit),User.countDocuments(filter)]);res.json({items,total,page,pages:Math.ceil(total/limit)});}));
router.get('/:id',asyncHandler(async(req,res)=>{const member=await User.findOne({_id:req.params.id,role:'member'}).select('-passwordHash');if(!member)return res.status(404).json({message:'Member not found'});const loans=await Loan.find({member:member._id}).populate('book','title coverImage').sort({createdAt:-1}).limit(30);res.json({member,loans});}));
router.post('/',[body('name').trim().isLength({min:2,max:100}),body('email').isEmail().normalizeEmail(),body('password').isLength({min:8}),validate],asyncHandler(async(req,res)=>{const {name,email,password,phone,address}=req.body;if(await User.exists({email}))return res.status(409).json({message:'Email already exists'});const member=await User.create({name,email,phone,address,passwordHash:await bcrypt.hash(password,12),membershipNumber:`LH-${Date.now().toString().slice(-8)}`,role:'member'});res.status(201).json({id:member._id,name:member.name,email:member.email,membershipNumber:member.membershipNumber});}));
router.patch('/:id',[body('name').optional().trim().isLength({min:2,max:100}),body('status').optional().isIn(['active','suspended']),validate],asyncHandler(async(req,res)=>{const member=await User.findOne({_id:req.params.id,role:'member'});if(!member)return res.status(404).json({message:'Member not found'});for(const k of ['name','phone','address','status','membershipExpiry'])if(req.body[k]!==undefined)member[k]=req.body[k];await member.save();res.json({id:member._id,name:member.name,email:member.email,status:member.status});}));
export default router;
