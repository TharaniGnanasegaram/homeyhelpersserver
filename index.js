const express = require('express');
const { ApolloServer } = require('apollo-server-express');

require('./models/db');

const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const ServiceProvider = require('./models/serviceProvider');
const Customer = require('./models/customer');
const Service = require('./models/services');
const ServiceProviderService = require('./models/serviceProviderServices');
const ServiceProviderAvailability = require('./models/serviceProviderAvailability');
const TimeSlots = require('./models/timeSlots');
const Booking = require('./models/bookings');
const Review = require('./models/review');


const typeDefs = `
    type serviceProvider {
        _id : String,
        id : Int,
        username : String,
        password : String,
        firstname : String,
        lastname : String,
        email : String,
        contactnumber : String
    }

    type customer {
      _id : String,
      id : Int,
      username : String,
      password : String,
      firstname : String,
      lastname : String,
      email : String,
      contactnumber : String,
      address : String
    }

    type service {
      _id : String,
      id : Int,
      servicename : String
    }

    type serviceProviderService {
      _id : String,
      id : Int,
      serviceproviderid : String,
      serviceprovidername : String,
      serviceprovideremail : String,
      serviceprovidercontact : String,
      serviceid : String,
      hourlyrate : Float,
      experience : String
    }

    type serviceProviderAvailability {
      _id : String,
      id : Int,
      serviceproviderservicesid : String,
      timeSlotid : String,
      start_time : String,
      end_time : String,
      duration : String
      servicedate : String,
      hourlyrate : Float,
      isavailable : Boolean,
      isBooked : Boolean
    }


    type timeSlots {
      _id : String,
      id : Int,
      start_time : String,
      end_time : String,
      duration : String
    }

    type review {
      _id : String,
      id : Int,
      serviceproviderservicesid : String,
      customerid : String,
      customername : String,
      reviewdate : String,
      reviewcomments : String
    }


    type bookings {
      _id : String,
      id : Int,
      serviceprovideravailabilityid : String,
      customerid : String,
      serviceproviderid : String,
      totalprice : Float,
      comments : String,
      status : String,
      start_time : String,
      end_time : String,
      duration : String,
      bookingdate : String,
      hourlyrate : Float,
      servicename : String,
      serviceproviderservicesid : String,
      serviceprovidername : String,
      serviceprovideremail : String,
      serviceprovidercontact : String,
      customername : String,
      customeremail : String,
      customercontact : String,
      customeraddress : String,

    }


    type Query {
        serviceProviderList(username: String, firstname : String): [serviceProvider],
        getServiceProvider(id: String) : serviceProvider,
        loginServiceProvider(username: String!, password: String!) : serviceProvider,
        

        customerList(username: String, firstname : String): [customer],
        getcustomer(id: String) : customer,
        logincustomer(username: String!, password: String!) : customer,


        getService(id : String) : service,
        getServiceByName(servicename : String) : service,
        getAllServices : [service],


        getTimeSlot(id : String) : timeSlots,
        getTimeSlotsByDuration(duration : String) : [timeSlots],

        
        getServiceProviderService(id : String) : serviceProviderService,
        ServiceProviderServiceList(serviceproviderid : String, serviceid : String) : [serviceProviderService],

        getServiceProviderAvailabilitySlot(id : String) : serviceProviderAvailability,
        getServiceProviderAvailabilitySlotList(serviceproviderservicesid : String) : [serviceProviderAvailability],
        getServiceProviderAvailabilitySlotListByDuration(serviceproviderservicesid : String, duration : String) : [serviceProviderAvailability],
        isServiceProviderSlotAvailable(serviceproviderservicesid : String!, servicedate : String!, timeSlotid : String!, start_time : String!, end_time : String!) : Boolean,

        getBooking(id : String) : bookings,
        getCustomerBookingList(customerid : String, servicedate : String, status : String) : [bookings],
        getServiceProviderBookingList(serviceproviderid : String, servicedate : String, status : String) : [bookings],

        getReviewByServiceProvider(serviceproviderservicesid : String) : [review],
        
        
    }

    type Mutation {
        createServiceProvider(username: String!, password: String!, firstname: String!, lastname: String!, email : String!, contactnumber : String!) : serviceProvider,
        
        createCustomer(username: String!, password: String!, firstname: String!, lastname: String!, email : String!, contactnumber : String!, address : String!) : customer,   
        
        createServiceProviderService(serviceproviderid : String!, serviceid : String!, hourlyrate: Float!, experience: String!) : serviceProviderService, 
        
        deleteServiceProviderService(id : String) : serviceProviderService,

        updateServiceProviderService(id : String!, hourlyrate: Float!, experience: String!) : serviceProviderService,

        createServiceProviderServiceAvailability(serviceproviderservicesid : String!, servicedate : String!, timeSlotid : String!) : serviceProviderAvailability, 

        deleteServiceProviderServiceAvailability(id : String) : serviceProviderAvailability,

        updateServiceProviderServiceAvailability(id : String!, starttime : String!, endtime : String!, duration: Float!) : serviceProviderAvailability,

        createBooking(serviceprovideravailabilityid : String!, customerid : String!, serviceproviderid : String!, totalprice : Float!, comments : String, bookingdate : String!) : bookings, 

        updateBookingStatus(id : String!, serviceprovideravailabilityid : String!, newstatus : String!) : bookings, 

        addReview(serviceproviderservicesid: String!, customerid: String!, reviewdate: String!, reviewcomments: String!) : review

    }

`;

const resolvers = {
  Query: {
    serviceProviderList,
    getServiceProvider,
    loginServiceProvider,

    customerList,
    getcustomer,
    logincustomer,

    getService,
    getServiceByName,
    getAllServices,

    getServiceProviderService,
    ServiceProviderServiceList,

    getServiceProviderAvailabilitySlot,
    getServiceProviderAvailabilitySlotList,
    getServiceProviderAvailabilitySlotListByDuration,
    isServiceProviderSlotAvailable,

    getTimeSlot,
    getTimeSlotsByDuration,
    getCustomerBookingList,
    getServiceProviderBookingList,

    getReviewByServiceProvider

  },

  Mutation: {
    createServiceProvider,
    createCustomer,
    createServiceProviderService,
    deleteServiceProviderService,
    updateServiceProviderService,
    createServiceProviderServiceAvailability,
    deleteServiceProviderServiceAvailability,
    updateServiceProviderServiceAvailability,
    createBooking,
    updateBookingStatus,
    addReview
  },

};

const apolloserver = new ApolloServer({
  typeDefs,
  resolvers,
});


// Service Provider

async function serviceProviderList(_, { username, firstname }) {

  let query = {};

  if (username !== "null" && username !== "" && username !== undefined) {
    query.username = username;
  }

  if (firstname !== "null" && firstname !== "" && firstname !== undefined) {
    query.firstname = firstname;
  }

  return (await ServiceProvider.find(query));

}


async function createServiceProvider(_, { username, password, firstname, lastname, email, contactnumber }) {

  const existingServiceProviderUsername = await ServiceProvider.findOne({ username });
  if (existingServiceProviderUsername) {
    throw new Error('Username already exists. Please provide a new username');
  }

  const existingServiceProviderEmail = await ServiceProvider.findOne({ email });
  if (existingServiceProviderEmail) {
    throw new Error('Email already exists. Please provide a new email');
  }

  const existingServiceProviderNum = await ServiceProvider.findOne({ contactnumber });
  if (existingServiceProviderNum) {
    throw new Error('Contact number already exists. Please provide a new contact number');
  }

  const newServiceProvider = {
    username,
    password,
    firstname,
    lastname,
    email,
    contactnumber
  };

  const PreId = await (ServiceProvider.find().count());
  newServiceProvider.id = PreId + 1;

  const createdServicePro = await ServiceProvider.create(newServiceProvider);

  return createdServicePro;

}


async function getServiceProvider(_, { id }) {

  return (await ServiceProvider.findById(new mongoose.Types.ObjectId(id)));
}


async function loginServiceProvider(_, { username, password }) {

  const isExistByUsername = await ServiceProvider.findOne({ username })

  if (isExistByUsername) {

    const same = await bcrypt.compare(password, isExistByUsername.password);

    if (same) {
      return isExistByUsername;
    }
    else {
      return null;
    }
  }

  else {
    return null;
  }

}

// ##############################################################################################################


// Customer


async function customerList(_, { username, firstname }) {

  let query = {};

  if (username !== "null" && username !== "" && username !== undefined) {
    query.username = username;
  }

  if (firstname !== "null" && firstname !== "" && firstname !== undefined) {
    query.firstname = firstname;
  }

  return (await Customer.find(query));

}


async function createCustomer(_, { username, password, firstname, lastname, email, contactnumber, address }) {

  const existingCustomerUsername = await Customer.findOne({ username });
  if (existingCustomerUsername) {
    throw new Error('Username already exists. Please provide a new username');
  }

  const existingCustomerEmail = await Customer.findOne({ email });
  if (existingCustomerEmail) {
    throw new Error('Email already exists. Please provide a new email');
  }

  const existingCustomerNum = await Customer.findOne({ contactnumber });
  if (existingCustomerNum) {
    throw new Error('Contact number already exists. Please provide a new contact number');
  }

  const newCustomer = {
    username,
    password,
    firstname,
    lastname,
    email,
    contactnumber,
    address
  };

  const PreId = await (Customer.find().count());
  newCustomer.id = PreId + 1;

  const createdCustomer = await Customer.create(newCustomer);

  return createdCustomer;

}


async function getcustomer(_, { id }) {

  return (await Customer.findById(new mongoose.Types.ObjectId(id)));
}


async function logincustomer(_, { username, password }) {

  const isExistByUsernameCustomer = await Customer.findOne({ username })

  if (isExistByUsernameCustomer) {

    const same = await bcrypt.compare(password, isExistByUsernameCustomer.password);

    if (same) {
      return isExistByUsernameCustomer;
    }
    else {
      return null;
    }
  }

  else {
    return null;
  }

}


// ##############################################################################################################

// Service


async function getService(_, { id }) {

  return (await Service.findById(new mongoose.Types.ObjectId(id)));
}


async function getServiceByName(_, { servicename }) {

  let query = {};

  if (servicename !== "null" && servicename !== "" && servicename !== undefined) {
    query.servicename = servicename;
  }

  return (await Service.find(query));

}

async function getAllServices() {

  return (await Service.find({}));

}



// #############################################################################################################

//time slots


async function getTimeSlot(_, { id }) {

  return (await TimeSlots.findById(new mongoose.Types.ObjectId(id)));
}


async function getTimeSlotsByDuration(_, { duration }) {

  let query = {};

  if (duration !== "null" && duration !== "" && duration !== undefined) {
    query.duration = duration;
  }

  return (await TimeSlots.find(query));

}

// ##############################################################################################################


//Service Provider Services

async function getServiceProviderService(_, { id }) {

  return (await ServiceProviderService.findById(new mongoose.Types.ObjectId(id)));
}


async function ServiceProviderServiceList(_, { serviceproviderid, serviceid }) {

  let query = {};

  if (serviceproviderid !== "null" && serviceproviderid !== "" && serviceproviderid !== undefined) {
    query.serviceproviderid = serviceproviderid;
  }

  if (serviceid !== "null" && serviceid !== "" && serviceid !== undefined) {
    query.serviceid = serviceid;
  }

  const serviceList = await ServiceProviderService.find(query).populate('serviceid').populate('serviceproviderid');

  return serviceList.map((service) => ({
    _id: service._id,
    id: service.id,
    // serviceproviderid: service.serviceproviderid,
    serviceid: service.serviceid.servicename,
    serviceprovidername: service.serviceproviderid.firstname + " " + service.serviceproviderid.lastname,
    serviceprovideremail: service.serviceproviderid.email,
    serviceprovidercontact: service.serviceproviderid.contactnumber,
    hourlyrate: service.hourlyrate,
    experience: service.experience
  }));

}


async function deleteServiceProviderService(_, { id }) {

  await ServiceProviderService.findByIdAndRemove(id)

}


async function createServiceProviderService(_, { serviceproviderid, serviceid, hourlyrate, experience }) {

  const existingServiceProviderService = await ServiceProviderService.findOne({ serviceproviderid, serviceid });
  if (existingServiceProviderService) {
    throw new Error('Service already added to you. Please select a different service!');
  }

  const newServiceProviderService = {
    serviceproviderid,
    serviceid,
    hourlyrate,
    experience
  };

  const PreId = await (ServiceProviderService.find().count());
  newServiceProviderService.id = PreId + 1;

  const createdServiceProviderService = await ServiceProviderService.create(newServiceProviderService);

  return createdServiceProviderService;

}


async function updateServiceProviderService(_, { id, hourlyrate, experience }) {

  await ServiceProviderService.findByIdAndUpdate(id, { hourlyrate: hourlyrate, experience: experience })

  const updatedService = await ServiceProviderService.findById(new mongoose.Types.ObjectId(id))

  return updatedService;
}


//Service Provider Available slots

async function getServiceProviderAvailabilitySlot(_, { id }) {

  return (await ServiceProviderAvailability.findById(new mongoose.Types.ObjectId(id)));
}


async function getServiceProviderAvailabilitySlotList(_, { serviceproviderservicesid }) {

  let query = {};


  if (serviceproviderservicesid !== "null" && serviceproviderservicesid !== "" && serviceproviderservicesid !== undefined) {
    query.serviceproviderservicesid = serviceproviderservicesid;
  }

  const serviceSlotsList = await ServiceProviderAvailability.find(query).populate('serviceproviderservicesid').populate('timeSlotid').sort('servicedate');

  return serviceSlotsList.map((slot) => ({
    _id: slot._id,
    id: slot.id,
    serviceproviderservicesid: slot.serviceproviderservicesid,
    timeSlotid: slot.timeSlotid._id,
    end_time: slot.timeSlotid.end_time,
    start_time: slot.timeSlotid.start_time,
    duration: slot.timeSlotid.duration,
    servicedate: slot.servicedate,
    isavailable: slot.isavailable,
    isBooked: slot.isBooked
  }));


}


async function getServiceProviderAvailabilitySlotListByDuration(_, { serviceproviderservicesid, duration }) {


  const serviceSlotsList = await ServiceProviderAvailability.find({ serviceproviderservicesid: serviceproviderservicesid, isBooked: false }).populate('serviceproviderservicesid').populate({
    path: 'timeSlotid',
    match: { duration: duration }
  }).sort('servicedate');

  return serviceSlotsList.filter((slot) => slot.timeSlotid).map((slot) => ({
    _id: slot._id,
    id: slot.id,
    serviceproviderservicesid: slot.serviceproviderservicesid._id,
    timeSlotid: slot.timeSlotid._id,
    end_time: slot.timeSlotid.end_time,
    start_time: slot.timeSlotid.start_time,
    duration: slot.timeSlotid.duration,
    servicedate: slot.servicedate,
    hourlyrate: slot.serviceproviderservicesid.hourlyrate,
    isavailable: slot.isavailable,
    isBooked: slot.isBooked
  }));


}


async function createServiceProviderServiceAvailability(_, { serviceproviderservicesid, servicedate, timeSlotid }) {

  const existingServiceProviderServiceAvailability = await ServiceProviderAvailability.findOne({ serviceproviderservicesid, servicedate, timeSlotid });
  if (existingServiceProviderServiceAvailability) {
    throw new Error('Slot already added. Please select a different slot!');
  }

  let isavailable = false;
  let isBooked = false;

  const newServiceProviderSlot = {
    serviceproviderservicesid,
    servicedate,
    timeSlotid,
    isavailable,
    isBooked
  };

  const PreId = await (ServiceProviderAvailability.find().count());
  newServiceProviderSlot.id = PreId + 1;

  const createdServiceProviderSlot = await ServiceProviderAvailability.create(newServiceProviderSlot);

  return createdServiceProviderSlot;

}


async function deleteServiceProviderServiceAvailability(_, { id }) {

  await ServiceProviderAvailability.findByIdAndRemove(id)

}



async function updateServiceProviderServiceAvailability(_, { id, starttime, endtime, duration }) {

  await ServiceProviderAvailability.findByIdAndUpdate(id, { starttime: starttime, endtime: endtime, duration: duration })

  const updatedServiceSlot = await ServiceProviderAvailability.findById(new mongoose.Types.ObjectId(id))

  return updatedServiceSlot;
}


function convertTime(time_parm) {

  const period = time_parm.slice(-2).toUpperCase();

  if (period === "AM" || (parseInt(time_parm.split(".")[0])) == 12) {

    const trimmedTimeString = time_parm.slice(0, -2);
    const timeInDecimal = parseFloat(trimmedTimeString).toFixed(2);

    return timeInDecimal;

  }

  else {

    const trimmedTimeString = time_parm.slice(0, -2);
    const timeInDecimal = parseFloat(trimmedTimeString).toFixed(2);
    const timein24 = parseFloat(timeInDecimal) + 12.00;

    return timein24;
  }
}



async function isServiceProviderSlotAvailable(_, { serviceproviderservicesid, servicedate, timeSlotid, start_time, end_time }) {

  let query = {};

  let isBooked = false;

  if (serviceproviderservicesid !== "null" && serviceproviderservicesid !== "" && serviceproviderservicesid !== undefined) {
    query.serviceproviderservicesid = serviceproviderservicesid;
  }

  if (servicedate !== "null" && servicedate !== "" && servicedate !== undefined) {
    query.servicedate = servicedate;
  }

  if (timeSlotid !== "null" && timeSlotid !== "" && timeSlotid !== undefined) {
    query.timeSlotid = timeSlotid;
  }

  const serviceSlot = await ServiceProviderAvailability.findOne(query);

  if (!serviceSlot) {

    // return false; 
    const serviceSlotInter = await ServiceProviderAvailability.find({
      serviceproviderservicesid: serviceproviderservicesid,
      servicedate: servicedate
    }).populate({
      path: 'timeSlotid'
      // match: { start_time: start_time }
    });

    if (serviceSlotInter.length == 0 && !isBooked) {
      isBooked = false;
    }

    else if (serviceSlotInter.length > 0) {

      serviceSlotInter.forEach(item => {
        if ((!item || !item.timeSlotid) && !isBooked) {
          isBooked = false;
        }

        const starttimeval = convertTime(start_time)
        const endtimeval = convertTime(end_time)
        const actualEndTime = convertTime(item.timeSlotid.end_time);
        const actualStartTime = convertTime(item.timeSlotid.start_time);


        if (!isBooked) {
          if ((parseFloat(starttimeval) >= parseFloat(actualStartTime) && parseFloat(endtimeval) <= parseFloat(actualEndTime))
            || (parseFloat(endtimeval) < parseFloat(actualEndTime) && parseFloat(endtimeval) > parseFloat(actualStartTime))
            || (parseFloat(starttimeval) < parseFloat(actualEndTime) && parseFloat(starttimeval) > parseFloat(actualStartTime))
            || (parseFloat(starttimeval) == parseFloat(actualStartTime) && parseFloat(endtimeval) == parseFloat(actualEndTime))
            || (parseFloat(endtimeval) >= parseFloat(actualEndTime) && parseFloat(starttimeval) < parseFloat(actualStartTime))
            || (parseFloat(endtimeval) > parseFloat(actualEndTime) && parseFloat(starttimeval) <= parseFloat(actualStartTime))
            || (parseFloat(starttimeval) == parseFloat(actualStartTime))
            || (parseFloat(endtimeval) == parseFloat(actualEndTime))) {
            isBooked = true;
          }
          else {
            isBooked = false;
          }
        }

      });

    }

  }
  else {
    isBooked = true;
  }
  return isBooked;

}


// ##############################################################################################################


// Booking

async function createBooking(_, { serviceprovideravailabilityid, customerid, serviceproviderid, totalprice, comments, bookingdate }) {


  let status = "Created";

  const newBooking = {
    serviceprovideravailabilityid,
    customerid,
    serviceproviderid,
    totalprice,
    bookingdate,
    comments,
    status
  };

  const PreId = await (Booking.find().count());
  newBooking.id = PreId + 1;

  const createdBooking = await Booking.create(newBooking);

  if (createBooking) {
    await ServiceProviderAvailability.findByIdAndUpdate(serviceprovideravailabilityid, { isBooked: true })
  }

  return createdBooking;

}


async function getCustomerBookingList(_, { customerid, servicedate, status }) {


  let query = {};


  if (customerid !== "null" && customerid !== "" && customerid !== undefined) {
    query.customerid = customerid;
  }

  if (servicedate !== "null" && servicedate !== "" && servicedate !== undefined) {
    query.bookingdate = servicedate;
  }

  if (status !== "null" && status !== "" && status !== undefined) {
    query.status = status;
  }

  // const bookinglist = await Booking.find(query).populate('serviceprovideravailabilityid');

  // return serviceSlotInter;

  const bookinglist = await Booking.find(query)
    .populate({
      path: 'serviceprovideravailabilityid',
      populate: {
        path: 'timeSlotid',
        select: 'start_time end_time duration',
      },
    })
    .populate({
      path: 'serviceprovideravailabilityid',
      populate: {
        path: 'serviceproviderservicesid',
        select: 'hourlyrate',
        populate: {
          path: 'serviceproviderid',
          select: 'firstname lastname email contactnumber',
        },
      },
    })
    .populate({
      path: 'serviceprovideravailabilityid',
      populate: {
        path: 'serviceproviderservicesid',
        populate: {
          path: 'serviceid',
          select: 'servicename',
        },
      },
    });


  return bookinglist.map((booking) => ({
    _id: booking._id,
    id: booking.id,
    serviceprovideravailabilityid: booking.serviceprovideravailabilityid._id,
    customerid: booking.customerid,
    totalprice: booking.totalprice,
    comments: booking.comments,
    status: booking.status,
    end_time: booking.serviceprovideravailabilityid.timeSlotid.end_time,
    start_time: booking.serviceprovideravailabilityid.timeSlotid.start_time,
    duration: booking.serviceprovideravailabilityid.timeSlotid.duration,
    bookingdate: booking.bookingdate,
    serviceproviderservicesid: booking.serviceprovideravailabilityid.serviceproviderservicesid._id,
    hourlyrate: booking.serviceprovideravailabilityid.serviceproviderservicesid.hourlyrate,
    servicename: booking.serviceprovideravailabilityid.serviceproviderservicesid.serviceid.servicename,
    serviceprovidername: booking.serviceprovideravailabilityid.serviceproviderservicesid.serviceproviderid.firstname + " " + booking.serviceprovideravailabilityid.serviceproviderservicesid.serviceproviderid.lastname,
    serviceprovideremail: booking.serviceprovideravailabilityid.serviceproviderservicesid.serviceproviderid.email,
    serviceprovidercontact: booking.serviceprovideravailabilityid.serviceproviderservicesid.serviceproviderid.contactnumber
  }));

}



async function getServiceProviderBookingList(_, { serviceproviderid, servicedate, status }) {


  let query = {};

  if (servicedate !== "null" && servicedate !== "" && servicedate !== undefined) {
    query.bookingdate = servicedate;
  }

  if (status !== "null" && status !== "" && status !== undefined) {
    query.status = status;
  }

  if (serviceproviderid !== "null" && serviceproviderid !== "" && serviceproviderid !== undefined) {
    query.serviceproviderid = serviceproviderid;
  }


  const bookinglist = await Booking.find(query)
    .populate({
      path: 'serviceprovideravailabilityid',
      populate: {
        path: 'timeSlotid',
        select: 'start_time end_time duration',
      },
    })
    .populate({
      path: 'serviceprovideravailabilityid',
      populate: {
        path: 'serviceproviderservicesid',
        select: 'hourlyrate',
        populate: {
          path: 'serviceproviderid',
          select: 'firstname lastname email contactnumber _id',
        },
      },
    })
    .populate({
      path: 'serviceprovideravailabilityid',
      populate: {
        path: 'serviceproviderservicesid',
        populate: {
          path: 'serviceid',
          select: 'servicename',
        },
      },
    })
    .populate({
      path: 'customerid',
      select: 'firstname lastname contactnumber email address',
    });


  return bookinglist.map((booking) => ({
    _id: booking._id,
    id: booking.id,
    serviceprovideravailabilityid: booking.serviceprovideravailabilityid._id,
    customerid: booking.customerid._id,
    totalprice: booking.totalprice,
    comments: booking.comments,
    status: booking.status,
    end_time: booking.serviceprovideravailabilityid.timeSlotid.end_time,
    start_time: booking.serviceprovideravailabilityid.timeSlotid.start_time,
    duration: booking.serviceprovideravailabilityid.timeSlotid.duration,
    bookingdate: booking.bookingdate,
    hourlyrate: booking.serviceprovideravailabilityid.serviceproviderservicesid.hourlyrate,
    servicename: booking.serviceprovideravailabilityid.serviceproviderservicesid.serviceid.servicename,
    customername: booking.customerid.firstname + " " + booking.customerid.lastname,
    customeremail: booking.customerid.email,
    customercontact: booking.customerid.contactnumber,
    customeraddress: booking.customerid.address
  }));

}



async function updateBookingStatus(_, { id, serviceprovideravailabilityid, newstatus }) {

  await Booking.findByIdAndUpdate(id, { status: newstatus })

  if (newstatus === "Rejected" || newstatus === "Cancelled") {
    await ServiceProviderAvailability.findByIdAndUpdate(serviceprovideravailabilityid, { isBooked: false })
  }

  const updatedBooking = await Booking.findById(new mongoose.Types.ObjectId(id))

  return updatedBooking;
}



// ##############################################################################################################
// reviews


async function getReviewByServiceProvider(_, { serviceproviderservicesid }) {


  const reviewList = await Review.find({ serviceproviderservicesid: serviceproviderservicesid }).populate('customerid').sort('reviewdate');

  return reviewList.map((review) => ({
    _id: review._id,
    id: review.id,
    serviceproviderservicesid: review.serviceproviderservicesid,
    customerid: review.customerid._id,
    customername: review.customerid.firstname + " " + review.customerid.lastname,
    reviewdate: review.reviewdate,
    reviewcomments: review.reviewcomments
  }));


}


async function addReview(_, { serviceproviderservicesid, customerid, reviewdate, reviewcomments }) {

  const newReview = {
    serviceproviderservicesid,
    customerid,
    reviewdate,
    reviewcomments
  };

  const PreId = await (Review.find().count());
  newReview.id = PreId + 1;

  const createdReview = await Review.create(newReview);

  return createdReview;

}


// ##############################################################################################################


const app = express();

app.use(express.static('public'));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

apolloserver.start()
  .then(() => {
    apolloserver.applyMiddleware({ app, path: '/graphql', cors: true });  // have to edit this at the end of testing
  });

app.listen('4000', () => {
  console.log('Server is running');
});