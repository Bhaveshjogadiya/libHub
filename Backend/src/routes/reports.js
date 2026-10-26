
import { Router } from 'express';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { Loan } from '../models/Loan.js';
import { Fine } from '../models/Fine.js';
import { protect, allowRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router=Router();router.use(protect,allowRoles('admin','librarian'));
router.get('/overview',asyncHandler(async(req,res)=>{const [books,copyTotals,members,activeLoans,overdue,fines,recentLoans,popular]=await Promise.all([
Book.countDocuments(),Book.aggregate([{$group:{_id:null,total:{$sum:'$totalCopies'},available:{$sum:'$availableCopies'}}}]),
User.countDocuments({role:'member',status:'active'}),Loan.countDocuments({status:{$in:['active','overdue']}}),
Loan.countDocuments({$or:[{status:'overdue'},{status:'active',dueAt:{$lt:new Date()}}]}),
Fine.aggregate([{$match:{status:{$in:['unpaid','partially_paid']}}},{$group:{_id:null,total:{$sum:{$subtract:['$amount','$paidAmount']}}}}]),
Loan.find().populate('book','title coverImage').populate('member','name').sort({createdAt:-1}).limit(6),
Loan.aggregate([{$group:{_id:'$book',count:{$sum:1}}},{$sort:{count:-1}},{$limit:5},{$lookup:{from:'books',localField:'_id',foreignField:'_id',as:'book'}},{$unwind:'$book'},{$project:{title:'$book.title',count:1}}])
]);res.json({books,totalCopies:copyTotals[0]?.total||0,availableCopies:copyTotals[0]?.available||0,members,activeLoans,overdue,outstandingFines:fines[0]?.total||0,recentLoans,popular});}));
router.get('/export',asyncHandler(async(req,res)=>{const books=await Book.find().lean();const csv=['Title,ISBN,Category,Total Copies,Available Copies',...books.map(b=>[b.title,b.isbn||'',b.category,b.totalCopies,b.availableCopies].map(v=>`"${String(v).replaceAll('"','""')}"`).join(','))].join('\n');res.setHeader('Content-Type','text/csv');res.setHeader('Content-Disposition','attachment; filename="libhub-inventory.csv"');res.send(csv);}));
export default router;
