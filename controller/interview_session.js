const InterviewSession = require('../models/Interview_session');

const Company = require('../models/Company');

//@desc     "Add a new appointment"
//@route    POST /api/v1/hospital/:hospitalId/appointment
//@access   Private

exports.addInterviewSession = async (req, res, next) => {
    try {
        //* add user id to the request body
        req.body.user = req.user.id;
        // console.log(req.user.name);
        //* check for existed appointment
        const existedInterviewSession = await InterviewSession.find({
            user: req.user.id,
        });

        //* if user is not an admin, they can only create 3 appointments
        if (existedInterviewSession.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                error: `The user with ID ${req.user.id} has already created 3 appointments.`
            });
        }
        //TODO change req.body.hospital = req.params.hospitalId;

        const company = await Company.findById(req.params.companyId);

        if (!company) {
            return res.status(400).json({
                success: false,
                message: `No hospital with the id ${req.params.companyId}`
            });
        }

        const interviewSession = await InterviewSession.create(req.body);

        res.status(200).json({
            success: true,
            data: interviewSession
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot create an interview session'
        });
    }
};
    
exports.getInterviewSession = async (req, res, next) => {
    try {
        const interviewSession = await InterviewSession.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name description tel',
        });

        if (!appointment) {
            return res.status(400).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot find Appointment'
        });
    }
}

exports.getAppointments=async (req,res,next)=>{
    let query;

     //* General users can see only their appointments!
    if(req.user.role !== 'admin'){ 
        query = Appointment.find({user:req.user.id}).populate({
            path:'hospital',
            select: 'name province tel'
        });
    }else{ //* If you are an admin, you can see all!
        if(req.params.hospitalId){
            query = Appointment.find({hospital:req.params.hospitalId}).populate({
                path:'hospital',
                select: 'name province tel'
            });
        } else {
            query = Appointment.find().populate({
                path:'hospital',
                select: 'name province tel'
            });
        }

    }
    try {
        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cannot find Appointment"
        });
    }
};

//@desc     "Update an appointment"
//@route    PUT /api/v1/appointment/:id
//@access   Private

exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);
        //* Make sure the user is the one who created the appointment
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this appointment`
            });
        }
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate({
            path: 'hospital',
            select: 'name description tel',
        });

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Cannot update Appointment"
        });
    }
};

//@desc     "Delete an appointment"
//@route    DELETE /api/v1/appointment/:id
//@access   Private

exports.deleteAppointment = async (req, res, next) => {
    try { 
        const appointment = await Appointment.findById(req.params.id);
        //* Make sure the user is the one who created the appointment
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this appointment`
            });
        }
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        await appointment.remove();
        
        res.status(200).json({
            success: true,
            message: 'Appointment deleted',
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete Appointment"
        });
    }
};  