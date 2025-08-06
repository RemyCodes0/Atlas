const Curation = require("../models/Curation")

const getCurations = async(req, res)=>{
    try{
        const curation = await Curation.find()
        res.status(200).json({curation})
    }catch(err){
        res.json(500).json({msg: "There was an error with the server", error: err})
    }
}

const createCurations = async(req, res) =>{
    const {title, content} = req.body
    try{
        const curation = new Curation({
            user: req.user.name,
            title,
            content
        })
        await curation.save()
        res.status(200).json(curation)
    }catch(err){
        res.status(500).json({msg: "There was an error with the server", error: err})
    }
}

const updateCuration = async (req,res)=>{
    const {id} = req.params
    const {title, content} = req.body
    try{
        const curation = await Curation.findById(id)
        if(!curation){
            return res.status(404).json({msg: "Curation not found"})
        }
        curation.title = title || curation.title
        curation.content = content || curation.content
        await curation.save()

        res.status(200).json({msg: "Curation updated", curation})
    }catch(err){
        res.status(500).json({msg: 'server error', error: err })
    }
}
const getCurationById = async (req, res) => {
  try {
    const curation = await Curation.findById(req.params.id)
    if (!curation) {
      return res.status(404).json({ msg: "Curation not found" })
    }
    res.status(200).json({ curation })
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err })
  }
}

const deleteCurationById = async(req,res) =>{
    const id = req.params.id;
       try{
           const curation = await Curation.findByIdAndDelete(id)
           if(!curation){
            res.status(404).json({msg: "The curation doesn't existe"})
           }
           res.status(200).json({msg: "The curation was successfully deleted", curation: curation})
       }catch(err){
           res.status(500).json({msg: "A server error happened", error: err})
       }
}


module.exports = { createCurations, getCurations, updateCuration, getCurationById, deleteCurationById}