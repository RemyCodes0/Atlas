const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const Task  = require("../models/Task")
const {createTask, getTask, getAssignedTasks, deleteTask, updateTask} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/createTasks", authMiddleware, createTask)
router.get("/my-tasks", authMiddleware, getTask )
router.get("/assignedTasks", authMiddleware, getAssignedTasks)
router.delete("/deleteTask/:id", authMiddleware, deleteTask)
router.put("/updateTask/:id", authMiddleware, updateTask)





const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/")
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}${ext}`);
    },
});

const upload = multer({storage})

router.put(
    "/tasks/:id/status",
    authMiddleware,
    upload.array("proofFiles", 5),
    async(req, res)=>{
        try{
            const taskId = req.params.id
            const { status, explanation, textProof}= req.body;
            const files = req.files;
            const task = await Task.findById(taskId);
            if(!task) return res.status(404).json({msg:"Task not found"});
            if(task.assignedTo.toString() !== req.user._id.toString()) 
                return res.status(403).json({msg:"Not Authorized"})


            task.status = status
            task.explanation = explanation || task.explanation || "";
            task.textProof = textProof || text.textProof||""


            if (files && files.length>0){
                const filePaths = files.map((file)=>`/uploads/${file.filename}`)
                task.proofFiles = filePaths;
            }

            await task.save();
            res.json(task);

        }catch(error){
            console.error("Error updating task status:", error);
            res.status(500).json({msg: "Server error"})
        }
    }
);













module.exports = router