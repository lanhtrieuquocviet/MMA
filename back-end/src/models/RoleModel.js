const mongoose = require("mongoose");

const roleSchema= new mongoose.Schema({
role_name:{
    type:String,
    required:true
}
})

const Role = mongoose.model("role", roleSchema);

module.exports = Role;

