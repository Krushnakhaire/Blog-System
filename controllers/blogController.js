const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');

exports. getAllBlogsController = async (req, res) => {
 try{
  const blogs=await blogModel.find({}).populate("user");
  if(!blogs){
    return res.status(200).send({
      success:false,
      message:'No Blogs Found'
    })
  }
  return res.status(200).send({
    success:true,
    BlogCount:blogs.length,
    message:'All Blogs Lists',
    blogs,
  });
  
  }catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:'Error While getting Blogs',
      error
    })
  }
};

exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;

   
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const existingUser = await userModel.findById(user);
    if(!existingUser){
      return res.status(404).send({
        success: false,
        message: "Unable to find User ",
      })
    }
  


    const newBlog = new blogModel({ title, description, image, user });
const session = await mongoose.startSession();
session.startTransaction();
await newBlog.save({ session });
existingUser.blogs.push(newBlog._id);
await existingUser.save({ session });
await session.commitTransaction();

    await newBlog.save();
    return res.status(201).send({
      success: true,
      message: "Blog Created Successfully",
       newBlog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while creating blog",
      error,
    });
  }
};

exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const existingBlog = await blogModel.findById(id);
    if (!existingBlog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true } 
    );

    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while updating blog",
      error,
    });
  }
};


exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).send({ 
        success: false,
        message: 'Blog not found',
      });
    }

    return res.status(200).send({
      success: true,
      message: 'Blog found',
      blog,
    });

  } catch (error) {
    console.error("Get Blog Error:", error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting blog',
      error,
    });
  }
};

exports.deleteBlogController = async(req,res) => {
  try{
    const {id}=req.params;
    const blog= await blogModel.findOneAndDelete(req.params.id).populate("user");

    await blog.user.blogs.pull(blog);
    await blog.user.save();    
    
      return res.status(200).send({
        success:true,
        message:'blog is Deleted',
        
      });
    

  }catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:'Error While Deleting Blog',
      error

    });
  }
};



exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate('blogs');
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: 'No Blogs Found with this id',
      });
    }
    return res.status(200).send({
      success: true,
      message: "User blogs fetched successfully",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: 'Error While Getting User Blogs',
      error,
    });
  }
};

