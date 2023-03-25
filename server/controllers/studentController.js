const Student = require('../models/Student');
const mongoose = require('mongoose');

exports.homepage = async (req, res) => {
    const messages = await req.consumeFlash('info');
    const locals = {
        title: 'Student List',
        description: "This is a current list of all my students"
    }
    let perPage = 12;
    let page = req.query.page || 1;

    try {
        const students = await Student.aggregate([ { $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        const count = await Student.count();

        res.render('index', {
            locals, students, current: page, pages: Math.ceil(count / perPage), messages
        });
    } catch (error) {
        console.log(error);
    }
}

// exports.homepage = async (req, res) => {
//     // Home
//     const messages = await req.consumeFlash('info');
//     const locals = {
//         title: 'James Scott',
//         description: 'My first user management app'
//     }
//     try {
//         const students = await Student.find({}).limit(22);
//         res.render('index', { locals, messages, students } );

//     } catch (error) {
//         console.log(error);
//     }
// }

exports.about = async (req, res) => {
    const locals = {
      title: 'About',
      description: 'This is a student contact system'
    }

    try {
      res.render('about', locals );
    } catch (error) {
      console.log(error);
    }
}

exports.addStudent = async (req, res) => {
    

    const locals = {
        title: 'Add New Student',
        description: 'A page to accept users'
    }
    res.render('student/add', locals );

}
exports.postStudent = async (req, res) => {
    const newStudent = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details
    });

   try {
    await Student.create(newStudent);
    await req.flash('info', "New Student has been added")
    res.redirect('/');
   } catch (error) {
    console.log(error);
   }
}

exports.view = async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.params.id })

        const locals = {
            title: 'Get Student',
            description: 'A page to get students'
        }
        res.render('student/view', { student, locals } );
    } catch (error) {
        console.log(error);
    }
}
exports.edit = async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.params.id })

        const locals = {
            title: 'Edit Student',
            description: 'A page to edit students'
        }
        res.render('student/edit', { student, locals } );
    } catch (error) {
        console.log(error);
    }
}

exports.editPost = async (req, res) => {
    try {
       await Student.findByIdAndUpdate(req.params.id,{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details,
        updatedAt: Date.now()
       });
       res.redirect(`/edit/${req.params.id}`);
       
    } catch (error) {
        console.log(error);
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        await Student.deleteOne({ _id: req.params.id });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}
exports.searchStudents = async (req, res) => {
    const locals = {
        title: "Search Student Data",
        description: "Search for students",
      };
    
      try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    
        const students = await Student.find({
          $or: [
            { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
            { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
          ]
        });
    
        res.render("search", {
          students,
          locals
        })
        
      } catch (error) {
        console.log(error);
      }
}