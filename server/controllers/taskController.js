const Task = require("../models/Task")

const createTask=async(req,res)=>{
    try{
        const {title, description, assignedTo, dueDate } = req.body;
        if(! title || !assignedTo){
            return res.status(400).json({msg: "Title and assigned to are required"})

        }
        if(!["CEO", "Vice", "President"].includes(req.user.role)){
            return res.status(403).json({msg: "Unauthorized to assign tasks"})
        }
        const task = new Task({
            title,
            description,
            assignedBy: req.user._id,
            assignedTo,
            dueDate,
        });
        await task.save();
        res.status(201).json(task);
    }catch(error){
        console.error("Error creating task:", error);
        res.status(500).json({msg: "Server error"})
    }
}

const getTask = async ( req, res )=>{
    try{
        const tasks = await Task.find({assignedTo: req.user._id})
        .populate("assignedBy", "name role")
        .sort({createdAt: -1})
        res.json(tasks);
    }catch(error){
        console.error("Error fetching tasks:",error);
        res.status(500).json({msg: "Server error"})
    }
}


const getAssignedTasks = async(req, res)=>{
    try{
        const tasks = await Task.find({assignedBy: req.user._id})
        .populate("assignedTo", "name email role").sort({createdAt:-1})
        res.json(tasks);
    }catch(error){
        console.error("Error fetching assigned tasks:", error);
        res.status(500).json({msg: "server error"})
    }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id); 
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateTask = async(req,res)=>{
    const updates = req.body
    try{
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {new: true, runValidators: true})
    if(!task){
       return res.status(404).json({msg: "Task not found"})
    }
    res.status(200).json({task})

    }catch(err){
        console.error("Server error")
        res.status(500).json({msg: "server error", error: err})
    }
}

const statusUpdate = async(req, res)=>{
    
        const taskId = req.params.id
        const { newStatus } = req.body
    try{
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(404).json({error: 'Task not found'})

        }
        if (newStatus ==='completed'){
            if(!task.proofFiles || task.proofFiles.length ===0){
                return res.status(400).json({error : "Please provide proof nefore making task as completedx"})
            }
        }

        const isProofValide = task.proofFiles.every(
            (proof)=>proof.type && proof.content
        )
        if(!isProofValide){
            return res.status(400).json({message: "All proof files must include both type and content"})
        } 
        task.status = newStatus;
        await task.save();
        return res.status(200).json({message:"status updated successfully", task})
    }catch(error){
        console.error(error)
        return res.status(500).json({error: 'server error'})
    }
    
}


const rejectTask = async (req, res) =>{
    const taskId= req.params.id
    const {rejectionReason} = req.body
    try{
        const task = await Task.findById(taskId)
    if(!task){
        return res.status(404).json({message: 'No such task in the DB'})
    }
    if(!rejectionReason){
        return res.status(400).json({message: "You must provide a reason to reject"})
    }
    task.rejectionReason = rejectionReason
    task.status = "rejected"
    await task.save()
    return res.status(200).json({message: "You have successfully rejected this task", task})
    }catch(err){
        res.status(500).json({msg: "The server had issue", error: err})
    }
}







module.exports= {createTask, getTask, getAssignedTasks, deleteTask, updateTask, statusUpdate, rejectTask}