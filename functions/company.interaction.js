const shortlistedCandidates = require("../model/interaction");
const studentData = require("../model/student");
const { mail } = require("../middlewares/mailer");
const jwt = require("jsonwebtoken");

const shortlistedCandidateslist = async(req, res) => {
    const { companyName } = req.body
    // will get Array of Strings containing Ids 
    const record = req.body.record;
    const arr = [];
    for(let i = 0;i < record.length;i++){
        arr.push(record[i]);
    }
    console.log(arr);
    await shortlistedCandidates.create({
        companyName,
        list: arr
    }).then(() => {
        res.status(201).json({ msg: "List created successfully"});
    }).catch((err) => {
        res.status(400).json({ msg: err });
    })
};

const markAllShortlisted = async(arr) => {
    for(let i = 0;i < arr.length;i++){
        const filter = { _id: arr[i] }
        await studentData.findOneAndUpdate( filter, { currentStatus: "In Progress" }, { new: true })
        .catch((err) => { message = err });
    }
}

const createListOfShortlistedCandidates = async(arr, companyName, email) => {
    const task = await shortlistedCandidates.create({
        companyName,
        list: arr
    });
    const token = jwt.sign({
        companyName,
        email,
        _id: task._id
    }, process.env.JWT_SECRET, { expiresIn: "15 day"});
    // console.log(token)
    const subject = "List of shortlisted candidates."
    const message = 
    `
    Hello Sir, 
    We are providing you the list of the shortlisted students on the basis of the shortlisting criteria provided by you.
    This link will only be valid for 15 days.
    Link: ${process.env.CLIENT + "?token=" + token}
    `
    console.log(message)
    // mail("preetkhatri07@gmail.com", subject, message);
}

const getEligibileCandidateList = async(req, res) => {
    // CGPA // year // age // email
    const { companyName, CGPA, year, age, email } = req.body;
    studentData.find({
        CGPA: { $gt: CGPA},
        age: { $lt: age},
        yearOfPassingOut: year,
        isSelected: false
    })
    .select({})
    .exec(function (err, info){
        if (err) return res.status(400).json({ "msg": err });
        else {
            const arr = [];
            for(let i = 0;i < info.length;i++){
                arr.push(info[i]._id);
            }

            markAllShortlisted(arr);

            try{
                createListOfShortlistedCandidates(arr, companyName, email);
            }
            catch(err){
                return res.status(400).json({ "msg": err });
            }

            return res.status(200).json(arr);
        }
    });
}

const renderShortlistedCandidate = async(req, res) => {
    const { token } = req.body;
    console.log(token);
    const payload = jwt.decode( token , process.env.JWT_SECRET, (err, authData) => {
        console.log(authData);
    })
    
    //find
    try{
        const query = await shortlistedCandidates.find({ _id: payload._id }).limit(1);
        const listOfAllCandidates = query[0].list;
        studentData.find().where("_id").in(listOfAllCandidates).select("rollNo name branch gender degree CGPA email contactNo linkedIn github resumeLink").exec((err, records) => {
            if(err) return res.status(400).json({ "msg": err });
            return res.status(200).json(records);
        });
    }
    catch (err){
        return res.status(400).json({ "msg": err })
    }
    
}


module.exports = { shortlistedCandidateslist, getEligibileCandidateList, renderShortlistedCandidate };