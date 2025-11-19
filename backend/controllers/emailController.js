const nodemailer = require('nodemailer');
const Trip = require('../models/Trip');
const User = require('../models/User');

const sendTripInvite = async (req, res) => {
    const { tripId, receiverEmail } = req.body;
    const senderId = req.userId; 

    try {
        const trip = await Trip.findById(tripId).populate('createdBy');
        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        if (trip.createdBy._id.toString() !== senderId) {
            return res.status(403).json({ msg: 'Only the trip creator can send invites' });
        }

        const inviteLink = `https://triphub-frontend.onrender.com/trip/${trip._id}/join`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"TripHub" <${process.env.EMAIL_ID}>`,
            to: receiverEmail,
            subject: `${trip.createdBy.name} invited you to join a trip on TripHub`,
            html: `
                <h2>You're invited!</h2>
                <p>Join the trip: <b>${trip.name}</b></p>
                <a href="${inviteLink}">Click to join the trip</a>
                <p>Please sign up or log in to accept the invite.</p>
            `
        });

        res.status(200).json({ msg: 'Invitation email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Could not send the invite' });
    }
};
module.exports = {sendTripInvite};

