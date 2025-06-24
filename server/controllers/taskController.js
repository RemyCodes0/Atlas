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

module.exports= {createTask, getTask, getAssignedTasks, deleteTask, updateTask}