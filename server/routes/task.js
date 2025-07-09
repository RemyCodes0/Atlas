const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const Task  = require("../models/Task")
const {createTask, statusUpdate, getTask, rejectTask, getAssignedTasks, deleteTask, updateTask} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/createTasks", authMiddleware, createTask)
router.get("/my-tasks", authMiddleware, getTask )
router.get("/assignedTasks", authMiddleware, getAssignedTasks)
router.delete("/deleteTask/:id", authMiddleware, deleteTask)
router.put("/updateTask/:id", authMiddleware, updateTask)
router.patch("/:id/status", authMiddleware, statusUpdate)
router.put("/:id/reject", authMiddleware, rejectTask)




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
  "/:id/status",
  authMiddleware,
  upload.array("proofFiles", 5),
  async (req, res) => {
    try {
      const taskId = req.params.id;
      const { status, textProof, proofDescription } = req.body;
      const files = req.files;

      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ msg: "Task not found" });

      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "Not Authorized" });
      }

      // Update status
      task.status = status || task.status;

      // Initialize proofFiles array if missing
      if (!Array.isArray(task.proofFiles)) {
        task.proofFiles = [];
      }

      // Add text proof only if not empty
      if (textProof && textProof.trim()) {
        task.proofFiles.push({
          type: "text",
          content: textProof.trim(),
          description: proofDescription || "",
          uploadedAt: new Date(),
        });
      }

      // Add uploaded files as image/video/file proof
      if (files && files.length > 0) {
        files.forEach((file) => {
          if (!file || !file.filename) return; // skip invalid file

          const ext = path.extname(file.originalname).toLowerCase();
          const isVideo = [".mp4", ".avi", ".mov"].includes(ext);
          const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
          const type = isVideo ? "video" : isImage ? "image" : "file";

          task.proofFiles.push({
            type,
            content: `/uploads/${file.filename}`,
            description: proofDescription || "",
            uploadedAt: new Date(),
          });
        });
      }

      // If no valid proof was added, return early with error
      if (task.proofFiles.length === 0) {
        return res.status(400).json({
          msg: "No valid proof was provided. Please upload a file or provide a text proof.",
        });
      }

      await task.save();
      res.json(task);

    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);














module.exports = router