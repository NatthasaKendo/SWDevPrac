const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    website: {
        type: String,
        require: [true, 'Please add a website'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    tel: {
        type: String,
    },    
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//* Reverse populate with virtuals
CompanySchema.virtual('InterviewSession', {
    ref: 'InterviewSession',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
});

//* Cascade delete InterviewSession when a hospital is deleted
CompanySchema.pre('remove', async function (next) {
    console.log(`InterviewSession being removed from company ${this._id}`);
    await this.model('InterviewSession').deleteMany({ company: this._id });
    next();
});

module.exports = mongoose.model('company', CompanySchema);