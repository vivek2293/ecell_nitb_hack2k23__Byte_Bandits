const companyData = require("../model/company");

const getAllCompanyrecords = async(req, res) => {
    const data = await companyData.find({});
    res.send(data);
};

const getAllCompanyname = async(req, res) => {
    const query = companyData.find({});
    query.select("companyName").exec(function(err, info) {
        if(err) return res.status(400).json({ msg: err });
        return res.status(200).json(info);
    })
}

const createCompanyRecord = async(req, res) => {
    const {
        companyName, email, location, websiteUrl
    } = req.body;

    await companyData.create({
        companyName, email, location, websiteUrl
    }).then(() => {
        return res.status(201).json({ msg: "Profile created successfully"});
    }).catch((err) => {
        console.log(err)
        return res.status(400).json({ msg: err });
    });
};

module.exports = { getAllCompanyrecords, createCompanyRecord, getAllCompanyname };